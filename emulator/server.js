// MARK: Imports
var express = require('express');
var path = require('path');
var MiraKit = require('mira-kit');


// MARK: Globals
var app = express();

// MARK: Routes
// app.get('/*', function(req, res) {
//   res.sendFile(path.resolve('static/app.html'));
// });

// MARK: Main
app.listen(3000, function() {
  console.log("Starting...");
});
