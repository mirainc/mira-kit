// MARK: Imports
import uuid from '../foundation/uuid.jsx';


// MARK: Types
type HTTPMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';
type HTTPEventType = (
  'fetch' // payload: {resourceId: string, ...options} (see README.md)
);


class MiraResource {
  // MARK: Properties
  pendingCallbacks: [Function, Function]
  url: string
  resourceId: string

  // MARK: Constructors
  constructor(url: string) {
    this.url = url;
    this.resourceId = uuid.v4();

    // bind & setup responders
    this.onWindowMessage = this.onWindowMessage.bind(this);
    window.addEventListener('message', this.onWindowMessage, false);
  }

  // MARK: Fetch Handlers
  get = this.fetch('GET');
  post = this.fetch('POST');
  put = this.fetch('PUT');
  delete = this.fetch('DELETE');
  head = this.fetch('HEAD');

  fetch(method: HTTPMethodType): (
    query_params?: Object,
    body_payload?: Object,
    headers?: Object,
    auth?: ?[string, string],
    timeout?: number,
    allow_redirects?: boolean
  ) => Promise<any> {
    return (
      query_params?: Object,
      body_payload?: Object,
      headers?: Object,
      auth?: ?[string, string],
      timeout?: number,
      allow_redirects?: boolean
    ) => {
      return new Promise((resolve, reject) => {
        this.pendingCallbacks = [resolve, reject];

        window.postMessage({
          eventName: 'fetch',
          payload: {
            resourceId: this.resourceId,
            method: method,
            url: this.url,
            query_params: query_params || {},
            body_payload: body_payload || {},
            headers: headers || {},
            auth: auth || null,
            timeout: timeout || 0,
            allow_redirects: allow_redirects || false
          }
        }, '*');
      });
    };
  }

  // MARK: Responders
  onWindowMessage(event: Event) {
    if (event.data.eventName === 'fetch-response') {
      console.log("IN RESOURCE: ", event.data.payload);
      window.removeEventListener('message', this.onWindowMessage);
    }
  }
}


// MARK: Exports
export default MiraResource;
