import { EventEmitter } from 'events';

const promiseEvent = <Event>(
  emitter: EventEmitter,
  eventName: string,
  predicate?: (event: Event) => boolean,
) =>
  new Promise(resolve => {
    const handleEvent = (event: Event) => {
      if (!!predicate && !predicate(event)) return;
      emitter.removeListener(eventName, handleEvent);
      resolve(event);
    };
    emitter.addListener(eventName, handleEvent);
  });

export default promiseEvent;
