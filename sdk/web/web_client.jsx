// MARK: Imports
import fetch from 'whatwg-fetch'


class WebClient {
  // MARK: HTTP/S Accessors
  get(url: string): Promise {
    return fetch(url).then((response) => {
        if (response.status >= 200 && response.status < 400) {
          return response
        }

        var error = new Error(response.statusText)
        error.response = response
        console.log(error)
        throw error
      })
    }
  }
}


// MARK: Exports
export default WebClient
