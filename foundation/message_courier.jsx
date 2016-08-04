// MARK: Imports
import uuid from './uuid.jsx';


class MessageCourier {
  // MARK: Properties
  window: Object
  pendingResponses: {[key: string]: [Function, Function]} = {}
  subscribers: {string: Array<(value: Object) => Promise<Object>>} = {}

  // MARK: Constructor
  constructor(window: Object) {
    this.window = window;

    // bind & attach responders
    this.onWindowMessage = this.onWindowMessage.bind(this);
    this.window.addEventListener('message', this.onWindowMessage, false);
  }

  // MARK: Message Handlers
  subscribeToMessage(
    messageName: string,
    responder: (value: Object) => Promise<Object>
  ) {
    this.subscribers[messageName] = this.subscribers[messageName] || [];
    this.subscribers[messageName].push(responder);
  }

  sendMessage(messageName: string, payload: Object): Promise<Object> {
    const requestId = uuid.v4();
    return new Promise((resolve: Function, reject: Function) => {
      this.pendingResponses[requestId] = [resolve, reject];
      console.log(messageName);
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

      subscribers.forEach((responder: (value: Object) => Promise<Object>) => {
        responder(event.data.payload).then((value: Object) => {
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
