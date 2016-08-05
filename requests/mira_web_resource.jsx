// MARK: Imports
import MiraResource from './mira_resource.jsx';


class MiraWebResource extends MiraResource {
  // MARK: Fetch Handlers
  get = this.request('GET');
  post = this.request('POST');
  put = this.request('PUT');
  delete = this.request('DELETE');
  head = this.request('HEAD');
}


// MARK: Exports
export default MiraWebResource;
