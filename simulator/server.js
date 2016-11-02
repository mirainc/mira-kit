// MARK: Imports
var express = require('express');
var path = require('path');
var fs = require('fs');


// MARK: Globals
var port = 3000;
var app = express();
app.use('/static', express.static(path.resolve(__dirname + '/..')));

// MARK: Routes
app.get('/*', function(req, res) {
  renderPage(
    res,
    app.miraSourceBundle,
    app.miraEmbeddedURLFormat,
    app.miraProps,
    app.miraStrings,
    app.miraFileSource
  );
});

// MARK: Accessors
function renderPage(res, sourceBundle, embeddedURLFormat, props, strings, fileSource) {
  console.log("Reloading source...");
  fs.readFile(sourceBundle, 'utf8', function(err, source) {
    const escapedAppSource = JSON.stringify(source);
    const escapedProps = JSON.stringify(props);
    const escapedStrings = JSON.stringify(strings);

    res.writeHead(200, {'Content-Type': 'text/html'});

    console.log(embeddedURLFormat);
    if (embeddedURLFormat) {
      // build matches
      var parameterRegex = /(:([\w]+))(.?$|[^\w])/gm;
      var matches = [];
      var match = null;
      do {
        match = parameterRegex.exec(
          embeddedURLFormat
        );

        if (match) {
          matches.push(match);
        }
      } while (match !== null);

      // replace
      var url = embeddedURLFormat;
      for (match of matches) {
        url = url.replace(
          match[1],
          props[match[2]]
        );
      }


      var body = `<iframe class="root" src="${url}"/>`;
    } else {
      var body = (
        `<script src="/static/simulator/simulator.js" type="text/javascript">
        </script>
        <script src="/static/container.js" type="text/javascript">
        </script>

        <div id="root"></div>
        <script type="text/javascript">
          window.App.main(
            ${escapedAppSource},
            ${escapedProps},
            ${escapedStrings}
          );
        </script>`
      );
    }

    res.write(`
      <html>
        <head>
          <script>window.fileSource = '${fileSource}';</script>
          <style>
            body, #root { margin: 0; }
            iframe { width: 100%; height: 100%; }
          </style>
        </head>
        <body>
          ${body}
        </body>
      </html>
    `);

    res.end();
  });
}

// MARK: Main
function runServer(appInfo, props, fileSource) {
  app.miraSourceBundle = appInfo.bundle;
  app.miraProps = props;
  app.miraStrings = appInfo.strings;
  app.miraFileSource = fileSource;
  app.miraEmbeddedURLFormat = appInfo.info.embedded_url_format;

  app.listen(port, function() {
    console.log("Starting Application Server on Port: " + port);
  });
}


// MARK: Exports
module.exports = runServer;
