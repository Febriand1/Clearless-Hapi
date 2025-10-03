import createServer from '../src/Infrastructures/http/createServer.js';
import container from '../src/Infrastructures/container.js';
import serverless from 'serverless-http';

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'ACCESS_TOKEN_KEY',
  'ACCESS_TOKEN_AGE',
];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    '[Vercel] Missing required environment variables:',
    missingEnvVars,
  );
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`,
  );
}

let _server;
let _handler;

async function handler(req, res) {
  try {
    console.log('[Vercel] Request incoming:', req.method, req.url);

    if (!_handler) {
      console.log('[Vercel] Creating Hapi server...');
      _server = await createServer(container);
      await _server.initialize();
      _handler = serverless(_server.listener, {
        binary: false,
        request: (request, event, context) => {
          // Ensure proper request handling
          request.url = request.url || '/';
          request.method = request.method || 'GET';
        },
      });
      console.log('[Vercel] Hapi server ready');
    }

    console.log('[Vercel] Calling serverless handler...');
    const result = await _handler(req, res);
    console.log('[Vercel] Handler completed');
    return result;
  } catch (err) {
    console.error('[Vercel] Server initialization failed:', err);
    console.error('[Vercel] Error details:', err.message);
    console.error('[Vercel] Stack trace:', err.stack);

    // Ensure response is sent
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          status: 'error',
          message: 'Internal Server Error',
          details:
            process.env.NODE_ENV === 'development' ? err.message : undefined,
        }),
      );
    }
  }
}

export default handler;
