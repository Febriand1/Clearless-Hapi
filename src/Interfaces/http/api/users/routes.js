const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'POST',
    path: '/users/verify-email',
    handler: handler.postVerifyEmailHandler,
  },
  {
    method: 'GET',
    path: '/users/me',
    handler: handler.getOwnUserHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'PATCH',
    path: '/users/me',
    handler: handler.patchOwnUserHandler,
    options: {
      auth: 'forumapi_jwt',
      payload: {
        parse: true,
        output: 'stream',
        multipart: true,
        maxBytes: 5 * 1024 * 1024,
      },
    },
  },
  {
    method: 'DELETE',
    path: '/users/me/avatar',
    handler: handler.deleteOwnAvatarHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

export default routes;
