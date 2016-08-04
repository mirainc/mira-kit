// MARK: Globals
window.simFetch = fetch;


// MARK: Heartbeats
function startHeartbeats() {
  var beat = 0;
  setInterval(function() {
    window.postMessage({
      eventName: 'heartbeat',
      payload: {beat: beat++}
    }, '*');
  }, 100);
}


// MARK: Message Dispatch
function messageDispatch(event) {
  if (event.data.eventName === 'heartbeat') {
    return;
  } else if (event.data.eventName === 'fetch') {
    var fetchData = event.data.payload;
    var responseData = {};

    simFetch(fetchData.url, fetchData).then(function(response) {
      if (response.status >= 200 && response.status < 400) {
        responseData.status_code = response.status;
        return response.blob();
      }

      const error = new Error(response.statusText);
      error.response = response;
      console.error(error);
      throw error;
    }).then(function(responseBlob) {
      responseData.blob = responseBlob;
      window.postMessage({
        eventName: 'fetch-response',
        payload: responseData
      }, '*');
    });
  }
}


// MARK: Main
startHeartbeats();
window.addEventListener('message', messageDispatch, false);
