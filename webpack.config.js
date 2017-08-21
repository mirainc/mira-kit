const path = require('path');

module.exports = options => ({
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'mira-kit.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      // { test: /.css$/, loader: 'style-loader!css-loader' },
    ],
  },
});
