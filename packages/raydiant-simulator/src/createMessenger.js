const source = 'raydiant-simulator';

// Messenger facilitates communication between the app preview
// (inner iframe) and the simulator (parent window).
export default (fromWindow, toWindow, onMessage) => {
  const receiveMessage = evt => {
    // Filter out any messages that aren't sent by the simulator or app preview.
    const isSimulatorMessage =
      evt.data && typeof evt.data === 'object' && evt.data.source === source;

    if (isSimulatorMessage) {
      onMessage(evt.data.type, evt.data.payload);
    }
  };

  fromWindow.addEventListener('message', receiveMessage, false);

  return {
    send(type, payload) {
      toWindow.postMessage({ source, type, payload }, '*');
    },
    unlisten() {
      fromWindow.removeEventListener('message', receiveMessage);
    },
  };
};
