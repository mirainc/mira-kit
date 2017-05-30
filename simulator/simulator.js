// MARK: Globals
if (!fetch) {
  console.error('MiraKit Simulator only works in Chrome.');
}
window._fetch = fetch;

// MARK: Heartbeats
function startHeartbeats() {
  var beat = 0;
  setInterval(function() {
    window.postMessage(
      {
        messageName: 'heartbeat',
        payload: { beat: beat++ },
      },
      '*',
    );
  }, 10);
}

// MARK: Web Requests
function _simFetch(request, requestId) {
  var responseData = {};

  window
    ._fetch(request)
    .then(function(response) {
      if (response.status >= 200 && response.status < 400) {
        responseData.statusCode = response.status;
        responseData.didRedirect = response.url !== request.url;
        responseData.url = response.url;

        responseData.headers = {};
        for (var entry of response.headers.entries()) {
          responseData.headers[entry[0]] = entry[1];
        }

        return response.arrayBuffer();
      }

      window.postMessage(
        {
          responseId: requestId,
          error: {
            code: response.status,
            message: response.statusText,
          },
        },
        '*',
      );
    })
    .then(function(raw) {
      responseData.raw = raw;
      window.postMessage(
        {
          responseId: requestId,
          payload: responseData,
        },
        '*',
      );
    });
}

// MARK: Trigger play event
function triggerPlay() {
  window.postMessage(
    {
      eventType: 'play',
    },
    '*',
  );
}

// MARK: Message Dispatch
function messageDispatch(event) {
  if (event.data.messageName === 'fetch') {
    var payload = event.data.payload;
    var req = new Request(payload.url, {
      method: payload.method,
      redirect: payload.allowRedirects ? 'follow' : 'manual',
      headers: payload.headers,
    });

    _simFetch(req, event.data.requestId);
  } else if (event.data.messageName === 'fetch-file') {
    var payload = event.data.payload;
    var url = window.fileSource + '/' + event.data.payload.propertyName;

    var req = new Request(url, {
      method: payload.method,
    });

    _simFetch(req, event.data.requestId);
  } else if (event.data.event) {
    if (
      event.data.event === 'presentation_ready' ||
      event.data.event === 'presentation_complete'
    ) {
      triggerPlay();
    }
  }
}

// MARK: Main
startHeartbeats();
window.addEventListener('message', messageDispatch, false);
