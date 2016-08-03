// MARK: Imports
var express = require('express');
var path = require('path');


// MARK: Globals
var PORT = 3000;
var app = express();
app.use('/static', express.static(path.resolve(__dirname + '/static')));

// MARK: Routes
app.get('/*', function(req, res) {
  renderPage(res, app.miraSource);
});

// MARK: Accessors
function renderPage(res, source) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(`
    <html>
      <body>
        <script type="text/javascript" id="loader">
          var _export = ${source};
          window.rootContainerClass = _export.default;
          console.log(window.rootContainerClass);
        </script>
        <div id="root"></div>
        <script src="./static/simulator.js" type="text/javascript"></script>
      </body>
    </html>
  `);
  res.end();
}

// MARK: Main
function runServer(source) {
  app.miraSource = source;
  app.listen(PORT, function() {
    console.log("Starting Application Server on Port: " + PORT);
  });
}


// MARK: Exports
module.exports = runServer;
