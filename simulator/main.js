#!/usr/bin/env node

// MARK: Imports
var program = require('commander');
var fs = require('fs');
var runServer = require('./server.js');


// MARK: Globals
program.version('0.0.1')
  .usage('[options] <source_bundle>')
  .option('-v, --vars [vars]', 'Application variables', JSON.parse)
  .parse(process.argv);

var sourceBundle = program.args[0];
fs.accessSync(sourceBundle);


// MARK: Main
function main(sourceBundle) {
  const props = program.vars || {};
  runServer(sourceBundle, props);
}

main(sourceBundle);
