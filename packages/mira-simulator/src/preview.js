// This is the entry file for webpack to build the app preview.
// It renders the app by passing the app path via an environment variable.
// The app config is sent to the simulator (parent window) for it can render
// presentation form and then sends back the app vars to render.

import React from 'react';
import ReactDOM from 'react-dom';
import { isMiraApp } from 'mira-kit';
import { extractProperties } from 'mira-kit/prop-types';
import AppPreview from './AppPreview';
import logger from './logger';

if (!process.env.MIRA_SIMULATOR_APP_CONFIG_PATH) {
  throw new Error(
    `Simulator is missing environment variable: MIRA_SIMULATOR_APP_CONFIG_PATH`,
  );
}

const requireConfig = () => {
  try {
    const config = require(process.env.MIRA_SIMULATOR_APP_CONFIG_PATH);
    // Support ES and CommonJS modules.
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
  logger.warning('Please make sure your app is wrapped with withMiraApp.');
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

// Construct the application definition from the config file.
const { properties, strings } = extractProperties(config.properties);
const appVersion = {
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

ReactDOM.render(
  <AppPreview
    appVersion={appVersion}
    allowedRequestDomains={config.allowedRequestDomains}
    simulatorOptions={config.simulator}
  >
    {props => <App {...props} />}
  </AppPreview>,
  document.getElementById('react-root'),
);
