const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: handler.getThreadByIdHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads',
    handler: handler.getAllThreadsHandler,
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}',
    handler: handler.deleteThreadHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

export default routes;
