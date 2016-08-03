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


// MARK: Main
startHeartbeats();
