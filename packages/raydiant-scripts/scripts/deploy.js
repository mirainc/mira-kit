// Deploy using production by default, but allow a different environment to be specified via NODE_ENV.
process.env.BABEL_ENV = process.env.BABEL_ENV || 'production';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
require('../config/env');

const chalk = require('chalk');
const fetch = require('node-fetch');
const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
const argv = require('minimist')(process.argv.slice(2));
const { extractProperties } = require('raydiant-kit/prop-types');
const paths = require('../config/paths');

const apiUrl = argv.api || 'https://api.raydiant.com';
const apiToken = argv.token;
const appId = argv.app;

// Makes the script crash on unhandled rejections instead of silently
// ignoring them.
process.on('unhandledRejection', err => {
  throw err;
});

async function deploy() {
  if (!apiToken) {
    throw new Error(`Missing token, provide it with --token=<token>.`);
  }

  if (!appId) {
    throw new Error(`Missing app id, provide it with --app=<app>.`);
  }

  const configPath = path.resolve(paths.appBuild, 'raydiant.config.js');
  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Could not find app config at ${configPath}. You may need to run '${
        paths.useYarn ? 'yarn build' : 'npm run build'
      }'`,
    );
  }

  const bundlePath = path.resolve(paths.appBuild, 'bundle.js');
  if (!fs.existsSync(bundlePath)) {
    throw new Error(
      `Could not find app bundle at ${bundlePath}. You may need to run '${
        paths.useYarn ? 'yarn build' : 'npm run build'
      } '`,
    );
  }

  let packageJson;
  try {
    packageJson = require(paths.appPackageJson);
  } catch (err) {
    throw new Error(`Error loading package.json: ${err.message}.`);
  }

  let config;
  try {
    // App bundles are eventually eval'd by the runtime. Configs are bundled
    // using the same webpack config as apps in webpack.prod.config,js so we must
    // also eval it here to read the resulting object.
    config = eval(fs.readFileSync(configPath).toString()); // eslint-disable-line no-eval
    if (typeof config === 'object' && config.__esModule) {
      config = config.default;
    }
  } catch (err) {
    throw new Error(`Error loading raydiant.config.js: ${err.message}.`);
  }

  const { properties, strings } = extractProperties(config.properties);

  const application = {
    name: config.name,
    version: packageJson.version,
    presentation_properties: properties,
    allowed_request_domains: config.allowedRequestDomains,
    strings: {
      // We only support english at this time, assuming all strings are in en.
      en: {
        ...strings,
        // These risk clobbering user defined strings, these should
        // be part of the main application object and have their own
        // db columns.
        description: config.description,
        callToAction: config.callToAction,
      },
    },
  };

  console.log(`Deploying app version ${chalk.cyan(application.version)}...`);

  // Publish new application version.
  const publishResponse = await fetch(
    `${apiUrl}/applications/${appId}/actions/publish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Mira-APIKey': apiToken,
      },
      credentials: 'include',
      body: JSON.stringify(application),
    },
  );
  if (!publishResponse.ok) {
    const message = await publishResponse.text();
    throw new Error(`Error publishing app: ${message}.`);
  }

  const appVersion = await publishResponse.json();

  // Upload bundle.js
  const bundleResponse = await upload(bundlePath, appVersion.source_url);
  if (!bundleResponse.ok) {
    throw new Error(`Error uploading bundle: ${bundleResponse.statusText}.`);
  }

  // Upload icon if it exists.
  const iconPath = path.resolve(paths.appBuild, 'icon.svg');
  if (fs.existsSync(iconPath)) {
    const iconResponse = await upload(iconPath, appVersion.icon_url);
    if (!iconResponse.ok) {
      throw new Error(`Error uploading icon: ${iconResponse.statusText}.`);
    }
  } else {
    console.log(chalk.yellow('No icon.svg found.'));
  }

  // Upload thumbnail if it exists.
  const thumbnailPath = path.resolve(paths.appBuild, 'thumbnail.svg');
  if (fs.existsSync(thumbnailPath)) {
    const thumbnailResponse = await upload(
      thumbnailPath,
      appVersion.thumbnail_url,
    );
    if (!thumbnailResponse.ok) {
      throw new Error(
        `Error uploading thumbnail: ${thumbnailResponse.statusText}.`,
      );
    }
  } else {
    console.log(chalk.yellow('No thumbnail.svg found.'));
  }

  console.log(chalk.green('Successfully deployed new app version.'));
  console.log();
}

async function upload(filePath, url) {
  const contentType = mime.lookup(path.extname(filePath));
  return await fetch(url, {
    method: 'PUT',
    body: fs.readFileSync(filePath),
    headers: {
      'Content-Type': contentType,
    },
  });
}

deploy().catch(err => {
  if (err && err.message) {
    console.log(chalk.red(err.message));
    console.log();
  }
  process.exit(1);
});
