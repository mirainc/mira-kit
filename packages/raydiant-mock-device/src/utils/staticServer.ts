import * as Koa from 'koa';
import * as serve from 'koa-static';
import * as path from 'path';

const staticServer = async (pathname: string) => {
  const app = new Koa();
  app.use(serve(path.resolve(process.cwd(), pathname)));
  let server;
  await new Promise(resolve => {
    // listen on any unused port, which can be retrieved with server.address().port
    // https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback
    server = app.listen(resolve);
  });
  return server;
};

export default staticServer;
