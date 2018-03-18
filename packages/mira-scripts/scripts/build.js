// We always build for production, do this first before any code
// that needs the correct env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them.
process.on('unhandledRejection', err => {
  throw err;
});

const chalk = require('chalk');
const fs = require('fs-extra');
const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} = require('react-dev-utils/FileSizeReporter');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printBuildError = require('react-dev-utils/printBuildError');
const promisify = require('util.promisify');
const webpack = require('webpack');
const config = require('../config/webpack.prod.config');
const paths = require('../config/paths');

const isCI =
  process.env.CI &&
  (typeof process.env.CI !== 'string' ||
    process.env.CI.toLowerCase() !== 'false');

async function build() {
  const previousFileSizes = await measureFileSizesBeforeBuild(paths.appBuild);
  // Clean build directory.
  fs.emptyDirSync(paths.appBuild);
  const compiler = webpack(config);
  const runCompiler = promisify(compiler.run.bind(compiler));
  try {
    console.log('Creating production build...');
    const stats = await runCompiler();
    const { errors, warnings } = formatWebpackMessages(stats.toJson({}, true));
    if (errors.length) {
      // Show the first error.
      throw new Error(errors[0]);
    }
    // Treat warnings as errors if running from CI.
    if (isCI && warnings.length) {
      throw new Error(warnings[0]);
    }
    if (warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'));
      console.log(warnings.join('\n\n'));
    } else {
      console.log(chalk.green('Compiled successfully.\n'));
    }

    console.log('File sizes after gzip:\n');
    printFileSizesAfterBuild(stats, previousFileSizes, paths.appBuild);
    console.log();
  } catch (err) {
    console.log(chalk.red('Failed to compile.\n'));
    printBuildError(err);
    process.exit(1);
  }
}

build().catch(err => {
  if (err && err.message) {
    console.log(err.message);
  }
  process.exit(1);
});
