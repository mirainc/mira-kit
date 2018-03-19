const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const webpack = require('webpack');
const paths = require('./paths');
const common = require('./webpack.common');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    // Enables auto reload.
    require.resolve('react-dev-utils/webpackHotDevClient'),
    // The simulator entry, the app path to load is set with
    // the MIRA_SIMULATOR_APP_PATH environment variable.
    require.resolve('mira-simulator/entry'),
  ],
  output: {
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    filename: 'bundle.js',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    ...common.resolve,
  },
  module: {
    ...common.module,
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: require.resolve('mira-simulator/index.html'),
    }),
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    // Makes some environment variables available to the JS code, for example:
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        MIRA_SIMULATOR_APP_INDEX_PATH: JSON.stringify(paths.appIndexJs),
        MIRA_SIMULATOR_APP_ICON_PATH: JSON.stringify(paths.appIcon),
        MIRA_SIMULATOR_APP_CONFIG_PATH: JSON.stringify(paths.appConfig),
        // TODO: Pass in any env vars prefixed with MIRA_APP_*
      },
    }),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    ...common.plugins,
  ],
  node: {
    ...common.node,
  },
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false,
  },
};
