// MARK: Imports
import uuid from './uuid.jsx';


// MARK: Types
type MessageResponderType = (payload: Object) => (Promise<Object> | void);


class MessageCourier {
  // MARK: Properties
  window: Object
  pendingResponses: { [key: string]: [Function, Function] } = {}
  subscribers: { string: Array<MessageResponderType> } = {}

  // MARK: Constructor
  constructor(window: Object) {
    this.window = window;

    // bind & attach responders
    this.onWindowMessage = this.onWindowMessage.bind(this);
    this.window.addEventListener('message', this.onWindowMessage, false);
  }

  // MARK: Message Handlers
  subscribeToMessage(messageName: string, responder: MessageResponderType) {
    this.subscribers[messageName] = this.subscribers[messageName] || [];
    this.subscribers[messageName].push(responder);
  }

  sendMessage(messageName: string, payload: Object): Promise<Object> {
    const requestId = uuid.v4();
    return new Promise((resolve: Function, reject: Function) => {
      this.pendingResponses[requestId] = [resolve, reject];
      this.window.postMessage({
        requestId: requestId,
        messageName: messageName,
        payload: payload
      }, '*');
    });
  }

  // MARK: Responders
  onWindowMessage(event: Event) {
    if (event.data.responseId !== undefined) {
      if (this.pendingResponses[event.data.responseId] === undefined) {
        return;
      }

      const resolve = this.pendingResponses[event.data.responseId][0];
      const reject = this.pendingResponses[event.data.responseId][1];

      if (event.data.error !== undefined) {
        reject(event.data.error);
        return;
      }

      resolve(event.data.payload);
      return;
    } else if (event.data.messageName !== undefined) {
      const subscribers = this.subscribers[event.data.messageName];
      if (subscribers === undefined) {
        return;
      }

      subscribers.forEach((responder: MessageResponderType) => {
        const promise = responder(event.data.payload);
        if (promise === undefined) {
          this.window.postMessage({
            responseId: event.data.requestId
          }, '*');
          return;
        }

        promise.then((payload: Object) => {
          this.window.postMessage({
            responseId: event.data.requestId,
            payload: value
          }, '*');
        });
      });

      return;
    }
  }
}


// MARK: Constants
const defaultCourier = new MessageCourier(window);


// MARK: Exports
export default MessageCourier;
export {
  defaultCourier
};
