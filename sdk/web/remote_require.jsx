// MARK: Imports
import WebClient from './web_client.jsx'


function requireFromString(src: string): Object {
  var Module = module.constructor;
  var m = new Module();
  m._compile(src);
  return m.exports;
}

function requireFromURL(url: string): Promise<Object> {
  var client = new WebClient()
  return client.get(url).then((response) => {
    return requireFromString(response.text)
  })
}


// MARK: Exports
export {requireFromString, requireFromURL}
