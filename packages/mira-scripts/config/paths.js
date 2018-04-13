const fs = require('fs');
const path = require('path');

// Make sure any symlinks in the project folder are resolved.
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
// const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appStatic: resolveApp('static'),
  appStaticPreview: resolveApp('static/preview'),
  appSrc: resolveApp('src'),
  appFiles: resolveApp('files'),
  appIndexJs: resolveApp('src/index.js'),
  appNodeModules: resolveApp('node_modules'),
  appPackageJson: resolveApp('package.json'),
  appIcon: resolveApp('icon.svg'),
  appThumbnail: resolveApp('thumbnail.svg'),
  simulatorDist: path.resolve(require.resolve('mira-simulator'), '../../dist'),
};

module.exports.useYarn = fs.existsSync(
  path.join(module.exports.appPath, 'yarn.lock'),
);

module.exports.resolveApp = resolveApp;
