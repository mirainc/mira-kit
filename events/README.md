# MiraEvents
MiraEvents is an EventEmitter that provides an API for communication between applications and the main runtime.

## API
Once your application has registered the lifecycle events that it utilizes, see [registering lifecycle events](#registering-lifecycle-events), you can use MiraEvents like below:

Usage:
```js
import { MiraEvents } from 'mira-kit';

MiraEvents.trigger('presentation_ready');

MiraEvents.on('play', () => {
  // Play application
});

// Presentation playthrough
MiraEvents.trigger('presentation_complete');
```

## Valid Events

### Presentation Ready
A `presentation_ready` event will inform the main runtime that the presentation is ready to be displayed on the screen.

### Play
A `play` event will be triggered by the maintime and can be subscribed to by applications to ensure timely playback.

### Presentation Complete
A `presentation_complete` event will inform the main runtime that it the the presentation has completed and can be transitioned away from.


## Registering Lifecycle Events
To register your lifecycle events, include the events that your application uses in your info.json. Events not registered here will be ignored by the main runtime.

## Future
Provide API for Applications to subscribe to events triggered from the main runtime.
