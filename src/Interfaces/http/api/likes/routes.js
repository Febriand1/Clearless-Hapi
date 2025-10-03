const routes = (handler) => [
  {
    method: 'PUT',
    path: '/threads/{threadId}/likes',
    handler: handler.updateLikeHandler,
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
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}/likes',
    handler: handler.updateLikeHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

export default routes;
