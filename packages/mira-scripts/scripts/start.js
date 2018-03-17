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
const config = require('../config/webpack.sim.config');
const createDevServerConfig = require('../config/webpackDevServer.config');

const defaultPort = parseInt(process.env.PORT, 10) || 3000;
const host = process.env.HOST || '0.0.0.0';
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const isInteractive = process.stdout.isTTY;

async function start() {
  const appName = require(paths.appPackageJson).name;
  const port = await choosePort(host, defaultPort);
  // TODO: Figure out what this is does.
  const urls = prepareUrls(protocol, host, port);
  const compiler = createCompiler(
    webpack,
    config,
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
