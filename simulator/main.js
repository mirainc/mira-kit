#!/usr/bin/env node

// MARK: Imports
var program = require('commander');
var fs = require('fs');
var runServer = require('./server.js');
var exec = require('child_process').exec;


// MARK: Globals
program.version('0.0.1')
  .usage('[options]')
  .option('--vars [vars]', 'Application variables', JSON.parse)
  .option('--filesource [source]', 'File source')
  .parse(process.argv);


// MARK: Functions
function appContents(appDir) {
  function fileContents(appFile, mutator) {
    if (mutator === undefined) {
      mutator = function(contents) { return contents; };
    }

    try {
      var path = appDir + '/' + appFile;
      var value = mutator(fs.readFileSync(path));
      return value;
    } catch (e) {
      console.error(appFile + ' does not exist.');
      throw e;
    }
  }

  return {
    info: fileContents('info.json', JSON.parse),
    strings: fileContents('strings.json', JSON.parse),
    bundle: !!fileContents('bundle.js') ? appDir + '/bundle.js' : null
  };
}

function validateVars(appVars, info) {
  return info.presentation_properties
    .concat({name: 'duration', type: 'int'})
    .every(function(prop) {
      if (!Object.keys(appVars).includes(prop.name)) {
        console.log(
          prop.name + ' not in vars (' + JSON.stringify(appVars) + ')'
        );
        return false;
      }

      return true;
    });
}

function openChrome() {
  exec(
    '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome ' +
    '--auto-open-devtools-for-tabs ' +
    'http://localhost:3000'
  );
}


// MARK: Main
function main() {
  var app = appContents('.');

  var appVars = program.vars || {};
  var fileSource = program.filesource || 'http://localhost:3000/static';

  if (!program.vars && !program.filesource) {
    console.log(
      'No command-line arguments found. ' +
      'Ensure that npm is passing arguments through:\n' +
      'npm run sim -- --vars \'{"duration": 60, ...}\'\n'
    );
  }

  if (validateVars(appVars, app.info)) {
    runServer(app, appVars, fileSource);
    openChrome();
  }
}

main();
