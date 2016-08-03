// MARK: Imports
var program = require('commander');
var fs = require('fs');
var runServer = require('./server.js');
var webpack = require('webpack');


// MARK: Globals
program.version('0.0.1')
  .usage('<source_bundle>')
  .parse(process.argv);

var sourceBundle = program.args[0];
fs.accessSync(sourceBundle);


// MARK: Main
function main(sourceBundle) {
  var compiler = webpack({
    entry: __dirname + '/static/application.jsx',
    output: { path: __dirname + '/static', filename: 'simulator.js' },
    module: {
      loaders: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['es2015', 'react'],
            plugins: ['transform-class-properties']
          }
        }
      ]
    }
  });

  compiler.run(function(err, stats) {
    console.log(stats.toString());
    fs.readFile(sourceBundle, 'utf8', function(err, source) {
      runServer(source);
    });
  });
}

main(sourceBundle);
