import EmailHandler from './handler.js';
import routes from './routes.js';

export default {
  name: 'email',
  register: async (server) => {
    const emailHandler = new EmailHandler();
    server.route(routes(emailHandler));
  },
};
