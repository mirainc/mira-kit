const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: path.resolve(__dirname, 'src/main'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.mjs'],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
          },
          {
            test: /\.(js|jsx|mjs)$/,
            exclude: [/[/\\\\]node_modules[/\\\\]/],
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              presets: [require.resolve('babel-preset-react-app')],
              cacheDirectory: true,
              highlightCode: true,
            },
          },
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
          {
            test: /\.css$/,
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
            ],
          },
          {
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
    new HtmlWebpackPlugin({
      inject: true,
      template: 'index.html',
    }),
    // Temporarily disable React production build to suppress warnings in development.
    // This will end up building with the development when running the static build.
    // We should probably create two builds of the simulator for development and production.
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify('production'),
    //   },
    // }),
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};
