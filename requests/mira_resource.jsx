// MARK: Types
type HTTPMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';
type HTTPEventType = (
  'fetch' // payload: {method: HTTPMethodType, ...options} (see README.md)
);


class MiraResource {
  // MARK: Fetch Handlers
  fetch(
    method: HTTPMethodType//,
    // query_params: {string: any},
    // body_payload: {string: any},
    // headers: {string: string},
    // auth: [string],
    // timeout: number,
    // allow_redirects: boolean
  ) {
    console.log(method);
  }
}


// MARK: Exports
export default MiraResource;
