#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const request = require('request-promise');

// Create file upload function
function uploadPresentationFile(fileUri, presignedUrl) {
  console.log(`Uploading ${fileUri}`);
  const file = fs.readFileSync(fileUri);
  return request({method: 'PUT', url: presignedUrl, body: file });
}

// load in consts from envs
const apiUrl = process.env.MIRA_API_URL || 'https://api.getmira.com';
const userName = process.env.MIRA_USER_NAME;
const userPassword = process.env.MIRA_USER_PASSWORD;
const appId = process.env.MIRA_APP_ID;

// Get directory where deploy is running from
const processDir = process.cwd();
console.log(`Running Deploy from ${processDir}`);
console.log('Validating application directory structure');

// Check for dist dir, icon, thumbnail, bundle.js, definition.json
const distDir = path.join(processDir, 'dist');
const bundlePath = path.join(distDir, 'bundle.js');
const iconPath = path.join(distDir, 'icon.svg');
const thumbnailPath = path.join(distDir, 'thumbnail.svg');

// Pull definition and package JSON
const definitionPath = path.join(processDir, 'definition.json');
const packagePath = path.join(processDir, 'package.json');
const definition = require(definitionPath);
const packageJson = require(packagePath);

// assume optional files exist, but if they don't save they don't.
const distExists = fs.existsSync(distDir);
const bundleExists = fs.existsSync(bundlePath);
const thumbnailExists = fs.existsSync(thumbnailPath);
const iconExists = fs.existsSync(iconPath);

//  NOTE: dist dir is required
if (!distExists) {
  throw new Error('directory dist/ is not found in your current project');
}

//  NOTE: bundle.js is required
if (!bundleExists) {
  throw new Error(
    'bundle.js is not found in your current project dist/ directory'
  );
}

// NOTE: icon.svg is optional
if (!iconExists) {
  console.warn('WARNING: no icon.svg found for project');
}

// NOTE: thumbnail.svg is optional
if (!thumbnailExists) {
  console.warn('WARNING: no thumbnail.svg found for project');
}

// Get app version and definition properties
const { version } = packageJson;
const { strings, lifecycle_events, presentation_properties, name, configurable_duration, allowed_request_domains } = definition;

// Presigned URL declarations
let iconUrl, thumbnailUrl, sourceUrl;

// Make requests to API
request({
  url: `${apiUrl}/users/login`,
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    username: userName,
    password: userPassword
  })
})
.then(response => {
  const apiToken = JSON.parse(response).Token;
  console.log('Logged in, publishing application');
  return request({
    url: `${apiUrl}/applications/${appId}/actions/publish`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiToken}`
    },
    credentials: 'include',
    body: JSON.stringify({
      version,
      name,
      presentation_properties,
      strings,
      lifecycle_events,
      configurable_duration,
      allowed_request_domains
    })
  });
})
.then(res => {
  const response = JSON.parse(res);
  const { deployment_id: deploymentId } = response;
  if (!deploymentId) {
    throw new Error(response);
  }
  iconUrl = response.icon_url;
  sourceUrl = response.source_url;
  thumbnailUrl = response.thumbnail_url;
})
.then(() => {
  if (iconExists) {
    return uploadPresentationFile(iconPath, iconUrl);
  }
  console.warn('WARNING: No icon was uploaded');
  return;
})
.then(() => {
  if (thumbnailExists) {
    return uploadPresentationFile(thumbnailPath, thumbnailUrl);
  }
  console.warn('WARNING: No thumbnail was uploaded');
  return;
})
.then(() => uploadPresentationFile(bundlePath, sourceUrl))
.catch(err => {
  throw new Error(err);
});
