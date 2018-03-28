// This is the entry file for webpack to build and run the simulator.
// It renders the app by passing the app path via an environment variable.

import React from 'react';
import ReactDOM from 'react-dom';
import Simulator from './Simulator';

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
    // Support ES and CommondJS modules.
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

ReactDOM.render(
  <Simulator icon={icon} config={config}>
    {props => <App {...props} />}
  </Simulator>,
  document.getElementById('react-root'),
);
