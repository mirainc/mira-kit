// This is the entry file for webpack to build the app preview.
// It renders the app by passing the app path via an environment variable.
// The app config is sent to the simulator (parent window) for it can render
// presentation form and then sends back the app vars to render.

import EventEmitter from 'eventemitter3';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  createFileResource,
  createRequestResource,
  captureSandboxFailure,
} from 'mira-resources';
import { isMiraApp } from 'mira-kit';
import { extractProperties } from 'mira-kit/prop-types';
import createMessenger from './createMessenger';

if (!process.env.MIRA_SIMULATOR_APP_CONFIG_PATH) {
  throw new Error(
    `Simulator is missing environment variable: MIRA_SIMULATOR_APP_CONFIG_PATH`,
  );
}

const requireConfig = () => {
  try {
    const config = require(process.env.MIRA_SIMULATOR_APP_CONFIG_PATH);
    // Support ES and CommondJS modules.
    return config && typeof config === 'object' && config.__esModule
      ? config.default
      : config;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

const config = requireConfig();
if (!config) {
  throw new Error(
    `Simulator failed to load config at path: ${
      process.env.MIRA_SIMULATOR_APP_CONFIG_PATH
    }`,
  );
}

if (!process.env.MIRA_SIMULATOR_APP_INDEX_PATH) {
  throw new Error(
    `Simulator is missing environment variable: MIRA_SIMULATOR_APP_INDEX_PATH`,
  );
}

const requireApp = () => {
  try {
    // For webpack dynamic require to work, we need to pass the env var directly to require.
    const app = require(process.env.MIRA_SIMULATOR_APP_INDEX_PATH);
    // Support ES and CommonJS modules.
    return app && typeof app === 'object' && app.__esModule ? app.default : app;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

const App = requireApp();
if (!App) {
  throw new Error(
    `Simulator failed to load app at path: ${
      process.env.MIRA_SIMULATOR_APP_INDEX_PATH
    }`,
  );
}

if (!isMiraApp(App)) {
  console.log(
    `⚠️%c Please make sure your app is wrapped with withMiraApp.`,
    'color:#f8b91c',
  );
}

const requireIcon = () => {
  try {
    if (process.env.MIRA_SIMULATOR_APP_ICON_PATH) {
      return require(process.env.MIRA_SIMULATOR_APP_ICON_PATH);
    } else {
      return '';
    }
  } catch (err) {
    return '';
  }
};

const icon = requireIcon();

// console.log(icon, config, App);
// Private fetch used for fetching in mira resources.
const privateFetch = window.fetch.bind(window);

// Clobber XMLHttpRequest because it is not available in the Mira sandbox.
window.XMLHttpRequest = captureSandboxFailure(
  'XMLHttpRequest',
  'miraRequestResource',
);

// Clobber fetch because it is not available on MiraLinks
window.fetch = captureSandboxFailure('fetch', 'miraRequestResource');

const miraEvents = new EventEmitter();
const mountNode = document.getElementById('react-root');
const render = appVars => {
  const props = {
    ...appVars,
    miraEvents,
    miraFileResource: createFileResource(privateFetch),
    miraRequestResource: createRequestResource(
      privateFetch,
      config.allowedRequestDomains,
    ),
  };

  ReactDOM.render(<App {...props} />, mountNode);
};

const messenger = createMessenger(window, window.parent, (type, payload) => {
  if (type === 'play') {
    miraEvents.emit('play');
  } else if (type === 'application_variables') {
    render(payload);
  }
});

// Forward presentation events to the parent window.
['presentation_ready', 'presentation_complete'].forEach(eventName => {
  miraEvents.on(eventName, () => messenger.send(eventName));
});

// Construct the application definition from the config file.
const { properties, strings } = extractProperties(
  config.presentationProperties,
);
const application = {
  name: config.name,
  icon_url: icon,
  presentation_properties: properties,
  strings: {
    ...strings,
    // This will clobber user-defined strings of the same name.
    // We should be storing these as their own db columns eventually.
    description: config.description,
    callToAction: config.callToAction,
  },
};

// Send the application definiton and all app variables to the parent window.
messenger.send('init', {
  application,
  applicationVariables: config.applicationVariables,
});
