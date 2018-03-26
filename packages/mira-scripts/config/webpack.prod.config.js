const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const path = require('path');
const webpack = require('webpack');
const paths = require('./paths');
const common = require('./webpack.common');
const getClientEnvironment = require('./env');

const env = getClientEnvironment();

module.exports = {
  // Don't attempt to continue if there are any errors.
  bail: true,
  devtool: 'source-map',
  entry: paths.appIndexJs,
  output: {
    // The build folder.
    path: paths.appBuild,
    filename: 'bundle.js',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  externals: {
    // React is injected into Mira apps in the dashboard and on the device.
    react: 'React',
  },
  resolve: {
    ...common.resolve,
  },
  module: {
    ...common.module,
  },
  plugins: [
    new webpack.DefinePlugin(env.stringified),
    new CopyWebpackPlugin([paths.appIcon, paths.appThumbnail]),
    // Compresses icon.svg, thumbnail.svg.
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    ...common.plugins,
  ],
  node: {
    ...common.node,
  },
};
