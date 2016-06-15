var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname);
var SDK_DIR = path.resolve(__dirname, 'sdk');

var config = {
  entry: [SDK_DIR + '/index.jsx'],
  output: {
    path: BUILD_DIR,
    filename: 'index.js'
  },

  module: {
    loaders: [
      {
        test: /\.(jsx)$/,
        include: SDK_DIR,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
          plugins: ['typecheck', 'syntax-flow', 'transform-class-properties']
        }
      }
    ]
  }
};

module.exports = config;
