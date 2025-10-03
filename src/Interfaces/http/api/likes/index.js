import LikesHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'likes',
  register: async (server, { container }) => {
    const likesHandler = new LikesHandler(container);
    server.route(routes(likesHandler));
  },
};
