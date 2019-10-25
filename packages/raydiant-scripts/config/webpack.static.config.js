const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const paths = require('./paths');
const common = require('./webpack.common');
const getClientEnvironment = require('./env');

module.exports = (relConfigPath = 'raydiant.config.js') => {
  const configPath = paths.resolveApp(relConfigPath);
  const env = getClientEnvironment({
    RAYDIANT_SIMULATOR_APP_INDEX_PATH: paths.appIndexJs,
    RAYDIANT_SIMULATOR_APP_CONFIG_PATH: configPath,
    RAYDIANT_SIMULATOR_APP_ICON_PATH: fs.existsSync(paths.appIcon)
      ? paths.appIcon
      : '',
  });

  return {
    devtool: 'cheap-module-source-map',
    entry: require.resolve('raydiant-simulator/preview'),
    output: {
      path: paths.appStaticPreview,
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
        template: require.resolve('raydiant-simulator/preview.html'),
      }),
      // Makes some environment variables available to the JS code.
      new webpack.DefinePlugin(env.stringified),
      new CopyWebpackPlugin([
        // Copy files to static preview directory.
        ...(fs.existsSync(paths.appFiles)
          ? [
              {
                from: paths.appFiles,
                to: paths.appStaticPreview,
                flatten: true,
              },
            ]
          : []),
        // Copy the simulator bundle to the root static directory.
        { from: paths.simulatorDist, to: paths.appStatic },
      ]),
      // Common plugins.
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
};
