// Start should always run in development.
// Do this first so all code reading it gets the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them.
process.on('unhandledRejection', err => {
  throw err;
});

const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const clearConsole = require('react-dev-utils/clearConsole');
const openBrowser = require('react-dev-utils/openBrowser');
const {
  choosePort,
  createCompiler,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const paths = require('../config/paths');
const createConfig = require('../config/webpack.preview.config');
const createDevServerConfig = require('../config/webpackDevServer.config');

const defaultPort = parseInt(process.env.PORT, 10) || 3000;
const host = process.env.HOST || '0.0.0.0';
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const isInteractive = process.stdout.isTTY;
const configPath = argv.config;

async function start() {
  const appName = require(paths.appPackageJson).name;
  const port = await choosePort(host, defaultPort);
  const urls = prepareUrls(protocol, host, port);
  // Inject custom urls for Mira device
  urls.lanUrlForTerminal = `${urls.lanUrlForTerminal}\n
  Run the following to view your app on your dev device:\n
  mira-cli device action enable-dev-url <device_id> '${protocol}://${
    urls.lanUrlForConfig
  }:${port}/?fullScreen=true&present=true'
  `;
  const compiler = createCompiler(
    webpack,
    createConfig(configPath),
    appName,
    urls,
    paths.useYarn,
  );

  const serverConfig = createDevServerConfig(urls.lanUrlForConfig);
  const devServer = new WebpackDevServer(compiler, serverConfig);
  // Launch WebpackDevServer.
  devServer.listen(port, host, err => {
    if (err) {
      throw err;
    }

    if (isInteractive) {
      clearConsole();
    }

    console.log(chalk.cyan('Starting the development server...\n'));
    openBrowser(urls.localUrlForBrowser);

    ['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close();
        process.exit();
      });
    });
  });
}

start().catch(err => {
  console.error(err.message);
  process.exit(1);
});
