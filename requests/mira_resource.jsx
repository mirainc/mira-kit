// MARK: Imports
import uuid from '../foundation/uuid.jsx';
import MiraResourceResponse from './mira_resource_response.jsx';
import { defaultCourier } from '../foundation/message_courier.jsx';


// MARK: Types
type HTTPMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';
type HTTPEventType = (
  'fetch' // payload: {resourceId: string, ...options} (see README.md)
);


class MiraResource {
  // MARK: Properties
  url: string
  resourceId: string

  // MARK: Constructors
  constructor(url: string) {
    this.url = url;
    this.resourceId = uuid.v4();
  }

  // MARK: Fetch Handlers
  get = this.fetch('GET');
  post = this.fetch('POST');
  put = this.fetch('PUT');
  delete = this.fetch('DELETE');
  head = this.fetch('HEAD');

  fetch(method: HTTPMethodType): (
    queryParams?: Object,
    bodyPayload?: Object,
    headers?: Object,
    timeout?: number,
    allowRedirects?: boolean
  ) => Promise<MiraResourceResponse> {
    return (
      queryParams?: Object,
      bodyPayload?: Object,
      headers?: Object,
      timeout?: number,
      allowRedirects?: boolean
    ) => {
      const messageResponse = defaultCourier.sendMessage('fetch', {
        resourceId: this.resourceId,
        method: method,
        url: this.url,
        queryParams: queryParams || {},
        bodyPayload: bodyPayload || {},
        headers: headers || {},
        timeout: timeout || 0,
        allowRedirects: allowRedirects || false
      });

      return messageResponse.then((value: Object) => {
        return new MiraResourceResponse(
          value.headers,
          value.didRedirect,
          value.statusCode,
          value.url,
          value.raw
        );
      });
    };
  }
}


// MARK: Exports
export default MiraResource;
