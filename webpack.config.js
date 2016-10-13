var path = require('path');
var webpack = require('webpack');
var loaders = [
  {
    test: /.jsx?$/,
    loader: 'babel-loader',
    query: {
      presets: ['es2015', 'react'],
      plugins: [
        'syntax-flow',
        'transform-class-properties',
        'transform-object-rest-spread'
      ]
    }
  }
];


module.exports = [
  {
    entry: './kit.jsx',
    output: {
      path: __dirname,
      filename: 'bundle.js',
      library: 'MiraKit',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    exclude: /node_modules/,
    target: 'node',
    module: {
      loaders: loaders
    }
  },
  {
    entry: './apps/app.jsx',
    output: { path: __dirname, filename: 'container.js' },
    module: {
      loaders: loaders
    }
  }
];
