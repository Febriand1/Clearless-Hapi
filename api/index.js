// api/index.js
import createServer from '../src/Infrastructures/http/createServer.js';
import container from '../src/Infrastructures/container.js';
import serverless from 'serverless-http';

let _server;
let _handler;

async function handler(req, res) {
  try {
    if (!_handler) {
      _server = await createServer(container);
      await _server.initialize();

      // wrap Hapi server jadi serverless handler
      _handler = serverless(_server.listener); // <-- gunakan serverless-http
      console.log('[Vercel] Hapi server initialized');
    }

    return _handler(req, res);
  } catch (err) {
    console.error('[Vercel] Server initialization failed:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

export default handler;
