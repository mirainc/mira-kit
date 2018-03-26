const fs = require('fs');
const path = require('path');

// Make sure any symlinks in the project folder are resolved.
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
// const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

module.exports = {
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appStatic: resolveApp('static'),
  appSrc: resolveApp('src'),
  appIndexJs: resolveApp('src/index.js'),
  appNodeModules: resolveApp('node_modules'),
  appPackageJson: resolveApp('package.json'),
  appIcon: resolveApp('icon.svg'),
  appThumbnail: resolveApp('thumbnail.svg'),
  appConfig: resolveApp('mira.config'),
};

module.exports.useYarn = fs.existsSync(
  path.join(module.exports.appPath, 'yarn.lock'),
);
