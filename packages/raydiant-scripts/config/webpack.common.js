const autoprefixer = require('autoprefixer');
const path = require('path');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const webpack = require('webpack');
const paths = require('./paths');

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.mjs'],
    alias: {
      // Resolve Babel runtime relative to raydiant-scripts.
      '@babel/runtime': path.dirname(
        require.resolve('@babel/runtime/package.json'),
      ),
    },
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      // Also Raydiant apps cannot contain multiple bundles.
      { parser: { requireEnsure: false } },
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
              baseConfig: {
                extends: [require.resolve('eslint-config-react-app')],
              },
              ignore: false,
              useEslintrc: false,
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        // We are using appPath not appSrc to make sure we include any raydiant.config.js
        // and raydiant.*.config.js files from the app directory.
        include: [paths.appPath],
        exclude: [/[/\\\\]node_modules[/\\\\]/],
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              // Raydiant apps must be a single js file so we set this to a large number
              // to ensure we always encode images as data urls.
              limit: Number.MAX_SAFE_INTEGER,
            },
          },
          // Process application JS with Babel.
          {
            test: /\.(js|jsx|mjs)$/,
            // We are using appPath not appSrc to make sure we include any raydiant.config.js
            // and raydiant.*.config.js files from the app directory.
            include: [paths.appPath],
            exclude: [/[/\\\\]node_modules[/\\\\]/],
            loader: require.resolve('babel-loader'),
            options: {
              // TODO: We probably want to some allow babelrc config for libs like EmotionJS
              // that come with their own babel plugins. See NextJS for how we might to this.
              babelrc: false,
              presets: [require.resolve('babel-preset-react-app')],
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              highlightCode: true,
            },
          },
          // Process any JS outside of the app with Babel.
          // Unlike the application JS, we only compile the standard ES features.
          {
            test: /\.js$/,
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              compact: false,
              presets: [require.resolve('babel-preset-react-app/dependencies')],
              cacheDirectory: true,
              highlightCode: true,
            },
          },
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader turns CSS into JS modules that inject <style> tags.
          // In production, we use a plugin to extract that CSS to a file, but
          // in development "style" loader enables hot editing of CSS.
          // By default we support CSS Modules with the extension .module.css
          {
            test: /\.css$/,
            // Exclude css modules (which we don't support yet).
            exclude: /\.module\.css$/,
            use: [
              {
                loader: require.resolve('style-loader'),
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebook/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({ flexbox: 'no-2009' }),
                  ],
                },
              },
            ],
          },
          // Inline fonts by converting them to data urls.
          {
            test: /\.(woff|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: 'base64-font-loader',
          },
          {
            // Fallback to file-loader.
            // Since Raydiant apps can only be a single bundle.js we never want this
            // loader to run. We are including it so the build doesn't error.
            // TODO: We should show warnings if  files are detected.
            // Exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: '[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Disable code-splitting.
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};
