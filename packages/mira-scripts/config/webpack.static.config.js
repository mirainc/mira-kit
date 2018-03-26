const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const paths = require('./paths');
const common = require('./webpack.common');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: require.resolve('mira-simulator/entry'),
  output: {
    path: paths.appStatic,
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
    ...common.plugins,
    // Minify.
    new UglifyJsPlugin({
      uglifyOptions: {
        ecma: 8,
        compress: {
          warnings: false,
          // Disabled because of an issue with Uglify breaking seemingly valid code:
          // https://github.com/facebook/create-react-app/issues/2376
          // Pending further investigation:
          // https://github.com/mishoo/UglifyJS2/issues/2011
          comparisons: false,
        },
        mangle: {
          safari10: true,
        },
        output: {
          comments: false,
          // Turned on because emoji and regex is not minified properly using default
          // https://github.com/facebook/create-react-app/issues/2488
          ascii_only: true,
        },
      },
      // Use multi-process parallel running to improve the build speed
      // Default number of concurrent runs: os.cpus().length - 1
      parallel: true,
      // Enable file caching
      cache: true,
      sourceMap: true,
    }),
  ],
  node: {
    ...common.node,
  },
};
