type EventType = 'presentation_ready' | 'presentation_complete';

const trigger = (event: EventType) => {
  window.postMessage(
    {
      event,
    },
    '*',
  );
};

export default {
  trigger,
};
