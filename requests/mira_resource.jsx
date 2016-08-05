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

    // bind responders
    this.onResponse = this.onResponse.bind(this);
  }

  // MARK: Request Handlers
  request(method: HTTPMethodType): (
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
      return defaultCourier.sendMessage('fetch', {
        resourceId: this.resourceId,
        method: method,
        url: this.url,
        queryParams: queryParams || {},
        bodyPayload: bodyPayload || {},
        headers: headers || {},
        timeout: timeout || 0,
        allowRedirects: allowRedirects || false
      }).then(this.onResponse);
    };
  }

  // MARK: Response Handlers
  onResponse(value: Object): MiraResourceResponse {
    return new MiraResourceResponse(
      value.headers,
      value.didRedirect,
      value.statusCode,
      value.url,
      value.raw
    );
  }
}


// MARK: Exports
export default MiraResource;
