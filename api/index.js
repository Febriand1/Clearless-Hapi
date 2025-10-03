import createServer from '../src/Infrastructures/http/createServer.js';
import container from '../src/Infrastructures/container.js';

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

async function handler(req, res) {
  try {
    console.log('[Vercel] Request incoming:', req.method, req.url);

    if (!_server) {
      console.log('[Vercel] Creating Hapi server...');
      _server = await createServer(container);
      await _server.initialize();
      console.log('[Vercel] Hapi server ready');
    }

    console.log('[Vercel] Processing request with Hapi...');

    // Use Hapi's inject method directly
    const result = await _server.inject({
      method: req.method,
      url: req.url,
      headers: req.headers,
      payload: req.body,
    });

    console.log('[Vercel] Hapi response status:', result.statusCode);
    console.log('[Vercel] Hapi response headers:', result.headers);

    // Set response headers
    Object.keys(result.headers).forEach((key) => {
      res.setHeader(key, result.headers[key]);
    });

    // Set status code
    res.statusCode = result.statusCode;

    // Send response
    res.end(result.payload);

    console.log('[Vercel] Response sent successfully');
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
