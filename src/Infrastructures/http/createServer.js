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

const createServer = async (container) => {
  const server = Hapi.server({
    // host: process.env.HOST,
    // port: process.env.PORT,
  });

  await server.register(Jwt);

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
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
  ]);

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      console.log('[HAPI] Root Handler Accessed!');
      return 'Halo dari Hapi.js di Vercel!';
    },
  });

  // server.ext('onPreResponse', (request, h) => {
  //   const { response } = request;

  //   if (response instanceof Error) {
  //     const translatedError = DomainErrorTranslator.translate(response);

  //     if (translatedError instanceof ClientError) {
  //       const newResponse = h.response({
  //         status: 'fail',
  //         message: translatedError.message,
  //       });
  //       newResponse.code(translatedError.statusCode);
  //       return newResponse;
  //     }

  //     if (!translatedError.isServer) {
  //       return h.continue;
  //     }

  //     const newResponse = h.response({
  //       status: 'error',
  //       message: 'terjadi kegagalan pada server kami',
  //     });
  //     newResponse.code(500);
  //     return newResponse;
  //   }

  //   return h.continue;
  // });

  return server;
};

export default createServer;
