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
  - [Upload Extensions](#upload-extensions)
1. [The App Life Cycle](#the-app-life-cycle)
  - [The Structure of an App](#the-structure-of-an-app)
  - [States for Apps](#states-for-apps)
1. [Deploying an App](#deploying-an-app)
1. [Core APIs](#core-apis)

## Getting Started
MiraKit is available on the npm registry.

To install, use: `npm install --save mira-kit`

## The App Bundle
_CONSOLIDATE INFO & APP_
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
- `text`: A long-form string.
  - `default`: string, optional. The default value for the text.
- `datetime`: A date and time.
  - `format`: string, required. A [Moment.js](http://momentjs.com/docs/#/parsing/string-format/)-style format string.
  - `default`: string, optional. The default value in the given format.
- `boolean`: A true or false value.
  - `default`: boolean, optional. The default value for the boolean.
- `number`: A numerical value.
  - `default`: number, optional. The default value for the number.
- `selection`: A series of options.
  - `exclusive`: boolean, optional. Prevents multiple selection.
  - `options`: list, required.
    - `name`: string, required.
    - `value`: string, required.
  - `default`: string. The `value` of the default. Required if `exclusive`.
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
Localizable text must be placed in the `strings` dictionary. The dictionary should map the ISO 639-1 language abbreviation to a dictionary mapping arbitrary string keys to readable, localized values.

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
The executable file contains your app's transpiled and bundled code. All markup, styling, and logic must be bundled into this file using webpack, Browserify, or some other bundler. The name of this file should be `bundle.js`.

At its top-most level, the file should export a subclass of `React.Component`. This component will use the React library present at runtime, and so it is important that you _do not import React into your bundle._

## The App Life Cycle
### The Structure of an App
_NEEDS TO BE RE-WRITTEN TO DISCUSS LIFECYCLE EVENTS_
Every Mira app is rendered in the context of the `Adapter` component, whose job is to facilitate the interactions between the Mira Platform and your app.

On startup, the system loads creates an `Adapter`, in which, your application will be rendered. The adapter passes the following resources to your Application as props:
- `instanceVariables` - each entry in the users configured presentation properties.
- `strings`, a representation of your app's `strings.json` file. To access a readable string, simply render `strings.your_key_name`, and the correct value will be chosen based on the language at runtime.
- `requestProxy` - The `Application` component, your root container, and your entire app will be evaluated, run, and displayed from within a sandboxed context. This sandbox cannot access to the device or browser in which it's presented, and many APIs present in typical browser contexts, such as `XMLHttpRequest`, have been removed in favor of this SDK's [core APIs](#core-apis). These APIs take into account your app's `info.json` configuration and adjusts access accordingly.
- `eventEmitter`

### States for Apps
_TODO: Remove reference to componentDidReceiveHeartbeat & add references to render life cycle photon_

Mira applications trigger lifecycle events which enable the application and the Mira platform to communicate between each other.

- The `presentation_ready` event is triggered by an application when it is ready to start playback on the Mira platform.
 - The Mira platform will respond to the application with a `play` event to indicate the application should begin playback.
- The `presentation_complete` event is triggered by an application when playback on the application is complete. This notifies the Mira platform that it can move to the next presentation.
 - If there is no subsequent application the platform will trigger another play event to loop the current application.

_NOTE: If a duration field is present in application variables, these events will be managed for you and triggered based on the duration set by the user._

## Deploying an App
When you register as a Mira developer, you will receive a developer secret. This secret should not be published anywhere, and will be used in conjunction with a webhook to deploy new versions of your app. After registering your app with Mira, you'll receive a webhook endpoint that, when used as post-commit hook in GitHub, will trigger our deploy service to clone and deploy the `HEAD` of your repository. The file structure of this repository must conform to the structure laid out in [the application bundle](#the-app-bundle) section.

## Core APIs
### [MiraResource](./resources/README.md)
The `MiraResource` class and related classes provide an API for making HTTP and HTTPS requests. Each object represents a request for a specific URL, following redirects if necessary. Requests are limited to allowed domains and file access specified in your app's `info.json` .

### [MiraEvents](./events/README.md)
MiraEvents is an EventEmitter that provides an API for communication between applications and the main runtime.

### MiraLocalStorage
_Coming Soon_

### MiraHDMIAccess
_Coming Soon_

### MiraBluetoothAccess
_Coming Soon_

### MiraLocationAccess
_Coming Soon_

### MiraPeerConnectivity
_Coming Soon_
