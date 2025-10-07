const routes = (handler) => [
  {
    method: 'GET',
    path: '/threads/{threadId}/likes',
    handler: handler.getLikeStatusHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/likes',
    handler: handler.updateLikeHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.getLikeStatusHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.updateLikeHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}/likes',
    handler: handler.getLikeStatusHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}/likes',
    handler: handler.updateLikeHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

export default routes;
