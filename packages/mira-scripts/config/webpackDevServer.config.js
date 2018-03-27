const express = require('express');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const paths = require('./paths');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

module.exports = allowedHost => ({
  // Enable gzip compression of generated files.
  compress: true,
  // Silence WebpackDevServer's own logs since they're generally not useful.
  // It will still show compile warnings and errors with this setting.
  clientLogLevel: 'none',
  // Serve simulator build from ../server
  contentBase: paths.server,
  // By default files from `contentBase` will not trigger a page reload.
  watchContentBase: true,
  // Enable hot reloading server.
  hot: true,
  // WebpackDevServer is noisy by default so we emit custom message instead
  // by listening to the compiler events with `compiler.plugin` calls above.
  quiet: true,
  // Enable History API.
  historyApiFallback: true,
  // Enable HTTPS if the HTTPS environment variable is set to 'true'
  https: protocol === 'https',
  host: host,
  overlay: false,
  public: allowedHost,
  before(app) {
    // This lets us open files from the runtime error overlay.
    app.use(errorOverlayMiddleware());
    // Serve local files from the app's files directory.
    app.use('/', express.static(paths.appFiles));
  },
});
