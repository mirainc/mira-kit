type EventType = 'presentation_ready' | 'presentation_complete' | 'play';

const trigger = (event: EventType) => {
  window.postMessage(
    {
      event,
    },
    '*',
  );
};

const on = (eventType: EventType, cb: any) => {
  window.addEventListener('message', (e: Object) => {
    const message = e.data;
    if (message.eventType === eventType) {
      cb();
    }
  });
};

export default {
  trigger,
  on,
};
