#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const fetch = require('isomorphic-fetch');
const request = require('request');

// Create file upload function
function uploadPresentationFile(fileUri, presignedUrl) {
  return new Promise((resolve,reject) => {
    fs.readFile(fileUri, (err, data) => {
      if(err){
        console.log(err);
        reject(err);
      }
      request({
        method: "PUT",
        url: presignedUrl,
        body: data
      }, function(err, res, body){
        if(err){
          console.log(err);
          reject(err);
        }
        resolve(res);
      });
    });
  });
}

// load in consts from envs
const apiUrl = process.env.MIRA_API_URL || 'https://api.getmira.com';
const userName = process.env.MIRA_USER_NAME;
const userPassword = process.env.MIRA_USER_PASSWORD;
const appId = process.env.MIRA_APP_ID;
const authorId = process.env.MIRA_AUTHOR_ID;

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
let thumbnailExists = true;
let iconExists = true;

if (!fs.existsSync(distDir)) {
  throw new Error('directory dist/ is not found in your current project');
}
if (!fs.existsSync(bundlePath)) {
  throw new Error('bundle.js is not found in your current project dist/ directory');
}
// NOTE: Need to decide if these need enforced.
if (!fs.existsSync(iconPath)) {
  iconExists = false;
  console.warn('WARNING: no icon.svg found for project');
}
if (!fs.existsSync(thumbnailPath)) {
  thumbnailExists = false;
  console.warn('WARNING: no thumbnail.svg found for project');
}

// Need to decide if this should live in definition or package.json
const  { version } = packageJson;
const { strings, lifecycle_events, presentation_properties, name } = definition;
let iconUrl, thumbnailUrl, sourceUrl;

// Make requests to API
fetch(`${apiUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
    		username: userName,
    		password: userPassword
    	})
}).then(response => response.json()
).then(result => {
  const apiToken = result.Token;
  console.log('Logged in, publishing application');
  return fetch(`${apiUrl}/applications/${appId}/actions/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiToken}`
    },
    credentials: 'include',
    body: JSON.stringify({
      version,
      author_id: authorId,
      name,
      presentation_properties,
      strings})
  })
}).then(response => {
    return response.json();
}
).then(response => {
  const { deployment_id: deploymentId } = response;
  if (!deploymentId) {
    throw new Error(JSON.stringify(response));
  }
  console.log(response);
  iconUrl = response.icon_url;
  sourceUrl = response.source_url;
  thumbnailUrl = response.thumbnail_url;
  console.log(deploymentId);
  console.log(iconUrl);
  console.log(sourceUrl);
  console.log(thumbnailUrl)
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
}).then(() => uploadPresentationFile(bundlePath, sourceUrl)
).catch(err => {
	console.log(err);
});
