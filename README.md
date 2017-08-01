# MiraKit
Mira's digital display SDK.

This document discusses the various components available to apps written for MiraLink devices.

Mira Apps are responsible for the rendering of presentations created by the user, and define the parameters of those presentations in the Mira Dashboard.

## Table of Contents
1. [Getting Started](#getting-started)
1. [The App Bundle](#the-app-bundle)
  - [definition.json](#defintion)
  - [Icons And Thumbnails](#icons-and-thumbnails)
  - [bundle](#the-executable)
1. [The App Life Cycle](#the-app-life-cycle)
  - [The Structure of an App](#the-structure-of-an-app)
  - [States for Apps](#states-for-apps)
1. [Core APIs](#core-apis)
1. [Testing Your Application](#testing-your-application)
1. [Deploying an App](#deploying-an-app)

## Getting Started
MiraKit is available on the npm registry.

To install, use: `npm install --save-dev mira-kit`

## The App Bundle

```bash
/your-app
  definition.json
  icon.svg
  thumbnail.svg
  bundle.js
```

### Definition
* The `definition.json` file contains metadata that defines how the Mira Platform interacts with your app.
* This information includes presentation properties which can be set by your users.
* The dictionary also includes its presentation type, which is used by the system to identify both your app and which presentations it should be launched with.

#### `definition.json` Keys
* `name`
  * type: `string`
  * The plain-text name of your app.
* `presentation_type`
  * type `string`
  * An identifier in the form of `company.app_name`. This must be unique.
* `presentation_properties`
  * type: `list`
  * A list of property definitions. The user-defined values constitute a "presentation" and will be passed to your app on launch.
* `allowed_request_domains`
  * type: `list`
  * A list of domains your app will need to access via HTTP/HTTPS.
* `requires_file_access`
  * type: `boolean`
  * Whether or not your app requires access to files uploaded for your app by your users. This value should be `true` for any app with a property of type `file`.
* `requires_local_store`
  * type: `boolean`
  * Whether or not your app requires access to local storage. Apps are currently limited to a small and variable amount of local storage.
* `configurable_duration`
  * type: `boolean`
  * Whether or not users can configure the duration of each presentation for your application. Defaults to `true`. Set to `false` if your application has a dynamic duration defined by lifecycle_events. Please see [MiraEvents](./events/README.md) for more details.
* `default_duration`
  * type: `number`
  * The default duration, in seconds, of your app's presentations.
* `embedded_url_format`
  * type: `string`
  * __Optional.__ A URL format using URL-param syntax: `https://my.service/:some_id?some_flag=:some_flag`. Used for embedded first- and second-party apps only.
* `lifecycle_events`
  * type: `list`
  * __Optional.__ A list of the events that your application triggers via `MiraEvents`. The main runtime will only listen for events specified here. Please see [MiraEvents](./events/README.md) for more details.
* `strings`

#### Property Definitions
Presentation property definitions are dictionaries that require that you specify the property's `name` and `type`, as well as any optional values that may alter the property's presentation in the Mira dashboard. The possible types of properties are:

- `string`: A short-form string.
  - `secure`: boolean, optional. Secure strings are displayed as password-style inputs.
  - `default`: string, optional. The default value for the string.
  - `placeholder`: string, optional. An optional placeholder for when no text is entered.
- `text`: A long-form string.
  - `default`: string, optional. The default value for the text.
  - `placeholder`: string, optional. An optional placeholder for when no text is entered.
- `datetime`: A date and time. The expected format of the datetime is ISO 8601 (example: `2000-02-01T09:00:00.000Z` is February 1st, 2000 at 9AM UTC)
  - `default`: UTC ISO string, optional. This value will be rendered in the simulator to local time, but passed to the application in UTC.
- `boolean`: A true or false value.
  - `default`: boolean, optional. The default value for the boolean.
- `number`: A numerical value.
  - `default`: number, optional. The default value for the number.
- `selection`: A series of options.
  - `exclusive`: boolean, optional. Prevents multiple selection.
  - `options`: list, required.
    - `name`: string, required.
    - `value`: string, required.
  - `default`: string, if `exclusive`, or array of strings. The `value` of the default. Required if `exclusive`.
- `file`: A file upload.
  - `constraints`: object, optional.
    - `content-types`: list, optional. A set of HTTP Content-Types that your app supports. Defaults to `*`.
    - `content-length`: int, optional. The maximum file size, in bytes, your app supports. Defaults to `100000000`.
- `link`: A clickable link. Takes no user value.
  - `url`: string, required. The URL to open when clicked.

For example, an Instagram app may have the property `ig_username`:
```json
{"name": "ig_username", "type": "string", "secure": false}
```

The text that is displayed in the dashboard for each property is derived from your app's `strings` defined in the `definition.json` file.

#### Localizable Strings
Localizable text must be placed in the `strings` dictionary inside `definition.json`. The dictionary should map the ISO 639-1 language abbreviation to a dictionary mapping arbitrary string keys to readable, localized values.

```json
{
  "en": {
    "ig_username": "Instagram Username"
  },

  "fr": {
    "ig_username": "Nom d'Utilisateur Instagram"
  }
}
```

Your app's `strings` must include at least one language localization for each property in `presentation_properties`.

Additionally, the Mira dashboard will expect your app to define at least one localization for several keys used in describing the app itself.
- `content_type`: The type of data your app handles. For example, the Video Player app's `content_type` in English is "Video", and a restaurant app's `content_type` in English might be "Menu."
- `description`: The plain-text description of your app and what it does.

This file should also include translations of any user-facing text for your app, and will be passed to your app at runtime.

### Icons and Thumbnails
Your app icon is used to represent your app in the Mira dashboard and should be `32pt` square. Its thumbnail is used to represent presentations created for your app and should be `110pt` wide by `62pt` tall. Both files should be SVGs.

### The Executable
_TODO: Add explicit script to create executeable_
The executable file contains your app's transpiled and bundled code. All markup, styling, and logic must be bundled into this file using webpack, Browserify, or some other bundler. The name of this file should be `bundle.js`.

At its top-most level, the file should export a subclass of `React.Component`.

## The App Life Cycle
### The Structure of an App
_NEEDS TO BE RE-WRITTEN TO DISCUSS LIFECYCLE EVENTS_
Every Mira app is rendered in the context defined by the Mira Platform.

On startup, the system loads creates the resources that will be available to your application and passed in as props:
- `instanceVariables` - each entry in the users configured presentation properties.
- `strings`, a representation of your app's `strings.json` file. To access a readable string, simply render `strings.your_key_name`, and the correct value will be chosen based on the language at runtime.
- `miraRequestProxy` - The `Application` component, your root container, and your entire app will be evaluated, run, and displayed from within a sandboxed context. This sandbox cannot access to the device or browser in which it's presented, and many APIs present in typical browser contexts, such as `XMLHttpRequest`, have been removed in favor of this SDK's [core APIs](#core-apis). These APIs take into account your app's `info.json` configuration and adjusts access accordingly.
- `miraEvents` -

### States for Apps
Mira applications trigger lifecycle events which enable the application and the Mira platform to communicate between each other.

- The `presentation_ready` event is triggered by an application when it is ready to start playback on the Mira platform.
 - The Mira platform will respond to the application with a `play` event to indicate the application should begin playback.
- The `presentation_complete` event is triggered by an application when playback on the application is complete. This notifies the Mira platform that it can move to the next presentation.
 - If there is no subsequent application the platform will trigger another play event to loop the current application.

_NOTE: If a duration field is present in application variables, these events will be managed for you and triggered based on the duration set by the user._

## Core APIs
### miraRequestProxy
The `miraRequestProxy` prop provides an API for making HTTP and HTTPS requests. Requests are limited to allowed domains and file access specified in your app's `info.json` .

The `miraRequestProxy` has an identical API to the [whatwg-fetch specification](https://github.github.io/fetch/).

The `miraFileRequestProxy` prop provides an API to fetch a file that has been uploaded to the Mira platform. This API takes `application variable` for the file you want to request, and the http `method` you want to use to request the object.

### miraEvents
The `miraEvents` prop is an EventEmitter that provides an API for communication between applications and the main runtime.

#### API
Once your application has registered the lifecycle events that it utilizes, see [registering lifecycle events](#registering-lifecycle-events), you can use MiraEvents like below:

Usage:
```js

this.props.miraEvents.trigger('presentation_ready');

this.props.miraEvents.on('play', () => {
  // Play application
});

// Presentation playthrough
this.props.miraEvents.trigger('presentation_complete');
```

#### Event Types
* Presentation Ready
  * A `presentation_ready` event will inform the main runtime that the presentation is ready to be displayed on the screen.
* Play
  * A `play` event will be triggered by the main runtime and can be subscribed to by applications to ensure timely playback.
* Presentation Complete
  * A `presentation_complete` event will inform the main runtime that it the the presentation has completed and can be transitioned away from.

#### Registering Lifecycle Events
To register your lifecycle events, include the events that your application uses in your info.json. Events not registered here will be ignored by the main runtime.

## Testing Your App

## Deploying an App
*TBD*
