#! /usr/bin/env node

const path = require('path');
const fs = require('fs');

// Get directory where deploy is running from
const processDir = process.cwd();
console.log(`Running Deploy from ${processDir}`);
console.log('Validating application directory structure');

// Check for dist dir, icon, thumbnail, bundle.js
const distDir = path.join(processDir, 'dist');
const bundlePath = path.join(distDir, 'bundle.js');
const iconPath = path.join(distDir, 'icon.svg');
const thumbnailPath = path.join(distDir, 'thumbnail.svg');

if (!fs.existsSync(distDir)) {
  throw new Error('directory dist/ is not found in your current project');
}
if (!fs.existsSync(bundlePath)) {
  throw new Error('bundle.js is not found in your current project dist/ directory');
}
if (!fs.existsSync(iconPath)) {
  console.warn('WARNING: no icon.svg found for project');
}
if (!fs.existsSync(thumbnailPath)) {
  console.warn('WARNING: no thumbnail.svg found for project');
}
