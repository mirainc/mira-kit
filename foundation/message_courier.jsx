// MARK: Imports
import uuid from './uuid.jsx';


// MARK: Types
type MessageResponderType = (payload: Object) => (Promise<Object> | void);


class MessageCourier {
  // MARK: Properties
  localWindow: Window
  remoteWindow: Window

  pendingResponses: { [key: string]: [Function, Function] } = {}
  subscribers: { string: Array<MessageResponderType> } = {}

  static __defaultCourier: MessageCourier

  // MARK: Constructors
  constructor(localWindow: Window, remoteWindow: Window) {
    this.localWindow = localWindow;
    this.remoteWindow = remoteWindow;

    // bind & attach responders
    this.onWindowMessage = this.onWindowMessage.bind(this);
    this.localWindow.addEventListener('message', this.onWindowMessage, false);
  }

  static defaultCourier() {
    if (MessageCourier.__defaultCourier === undefined) {
      MessageCourier.__defaultCourier = new MessageCourier(
        window,
        window.parent
      );
    }

    return MessageCourier.__defaultCourier;
  }

  deconstruct() {
    this.localWindow.removeEventListener('message', this.onWindowMessage);
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
      this.remoteWindow.postMessage({
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
      this.pendingResponses[event.data.responseId] = undefined;

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
          this.remoteWindow.postMessage({
            responseId: event.data.requestId,
            payload: {}
          }, '*');
          return;
        }

        promise.then((payload: Object) => {
          this.remoteWindow.postMessage({
            responseId: event.data.requestId,
            payload: payload
          }, '*');
        });
      });

      return;
    }
  }
}


// MARK: Exports
export default MessageCourier;
