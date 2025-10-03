// api/index.js
import createServer from '../src/Infrastructures/http/createServer.js';
import container from '../src/Infrastructures/container.js';
import serverless from 'serverless-http';

let _server;
let _handler;

async function handler(req, res) {
  try {
    console.log('[Vercel] Request incoming');
    if (!_handler) {
      console.log('[Vercel] Creating Hapi server...');
      _server = await createServer(container);
      _handler = serverless(_server.listener);
      console.log('[Vercel] Hapi server ready');
    }
    return _handler(req, res);
  } catch (err) {
    console.error('[Vercel] Server initialization failed:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

export default handler;
