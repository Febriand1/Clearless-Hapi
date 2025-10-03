import createServer from '../src/Infrastructures/http/createServer.js';
import container from '../src/Infrastructures/container.js';

let _server;

async function handler(req, res) {
  if (!_server) {
    _server = await createServer(container);
    await _server.initialize();
  }
  return _server.listener(req, res);
}

export default handler;
