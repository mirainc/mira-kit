type EventType = 'presentation_ready' | 'presentation_complete';

const trigger = (event: EventType, payload: Object) => {
  window.postMessage({
    event,
    payload,
  });
};

export default {
  trigger,
};
