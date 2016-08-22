// MARK: Imports
import MiraResource from './mira_resource.jsx';
import MessageCourier from '../foundation/message_courier.jsx';


class MiraFileResource extends MiraResource {
  // MARK: Constructors
  constructor(propertyName: string) {
    super('');
    this.propertyName = propertyName;
  }

  // MARK: Fetch Handlers
  get(): Promise<MiraResourceResponse> {
    return MessageCourier.defaultCourier().sendMessage('fetch-file', {
      resourceId: this.resourceId,
      method: 'GET',
      propertyName: this.propertyName
    }).then(this.onResponse);
  }

  head(): Promise<MiraResourceResponse> {
    return MessageCourier.defaultCourier().sendMessage('fetch-file', {
      resourceId: this.resourceId,
      method: 'HEAD',
      propertyName: this.propertyName
    }).then(this.onResponse);
  }
}


// MARK: Exports
export default MiraFileResource;
