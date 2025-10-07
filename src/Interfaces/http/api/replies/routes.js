const routes = (handler) => [
  {
    method: 'GET',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.getRepliesByCommentHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postReplyHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.deleteReplyHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

export default routes;
