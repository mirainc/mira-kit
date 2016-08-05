// MARK: Imports
var express = require('express');
var path = require('path');
var fs = require('fs');


// MARK: Globals
var PORT = 3000;
var app = express();
app.use('/static', express.static(path.resolve(__dirname + '/..')));

// MARK: Routes
app.get('/*', function(req, res) {
  renderPage(res, app.miraSourceBundle, app.miraProps);
});

// MARK: Accessors
function renderPage(res, sourceBundle, props) {
  console.log("Reloading source...");
  fs.readFile(sourceBundle, 'utf8', function(err, source) {
    const escapedAppSource = JSON.stringify(source);
    const escapedProps = JSON.stringify(props);

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(`
      <html>
        <head>
          <style>
            body, #root { margin: 0; }
          </style>
        </head>
        <body>
          <script src="/static/container.js" type="text/javascript">
          </script>
          <script src="/static/simulator/simulator.js" type="text/javascript">
          </script>

          <div id="root"></div>
          <script type="text/javascript">
            window.App.main(
              ${escapedAppSource},
              ${escapedProps}
            );
          </script>
        </body>
      </html>
    `);
    res.end();
  });
}

// MARK: Main
function runServer(sourceBundle, props) {
  app.miraSourceBundle = sourceBundle;
  app.miraProps = props;

  app.listen(PORT, function() {
    console.log("Starting Application Server on Port: " + PORT);
  });
}


// MARK: Exports
module.exports = runServer;
