import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import ClientError from '../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';
import users from '../../Interfaces/http/api/users/index.js';
import authentications from '../../Interfaces/http/api/authentications/index.js';
import threads from '../../Interfaces/http/api/threads/index.js';
import comments from '../../Interfaces/http/api/comments/index.js';
import replies from '../../Interfaces/http/api/replies/index.js';
import likes from '../../Interfaces/http/api/likes/index.js';
import email from '../../Interfaces/http/api/email/index.js';
import { config } from '../../Utils/config.js';

const createServer = async (container) => {
  const server = Hapi.server({
    host: config.server.host,
    port: config.server.port,
    routes: {
      cors: {
        origin: ['*'], // For production, you should restrict this to your frontend domain
      },
    },
  });

  await server.register(Jwt);

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: config.tokenize.accessToken,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.tokenize.accessTokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
    {
      plugin: replies,
      options: { container },
    },
    {
      plugin: likes,
      options: { container },
    },
    {
      plugin: email,
    },
  ]);

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      console.log('[HAPI] Root Handler Accessed!');
      return h
        .response({
          status: 'success',
          message: 'Halo dari Hapi.js di Vercel!',
          timestamp: new Date().toISOString(),
        })
        .code(200);
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);
      // console.log(translatedError);

      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  return server;
};

export default createServer;
