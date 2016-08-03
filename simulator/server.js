// MARK: Imports
var express = require('express');
var path = require('path');


// MARK: Globals
var PORT = 3000;
var app = express();
app.use('/static', express.static(path.resolve(__dirname + '/..')));

// MARK: Routes
app.get('/*', function(req, res) {
  renderPage(res, app.miraSource, app.miraProps);
});

// MARK: Accessors
function renderPage(res, source, props) {
  const escapedAppSource = JSON.stringify(source);
  const escapedProps = JSON.stringify(props);

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(`
    <html>
      <body>
        <script src="/static/bundle.js" type="text/javascript">
        </script>

        <div id="root"></div>
        <script src="/static/simulator/simulator.js" type="text/javascript">
        </script>

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
}

// MARK: Main
function runServer(source, props) {
  app.miraSource = source;
  app.miraProps = props;

  app.listen(PORT, function() {
    console.log("Starting Application Server on Port: " + PORT);
  });
}


// MARK: Exports
module.exports = runServer;
