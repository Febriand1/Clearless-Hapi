const routes = (handler) => ([
  {
    method: 'POST',
    path: '/queue/email-verification',
    handler: handler.postEmailVerificationHandler,
    options: {
      auth: false, // Open endpoint, security is handled by Qstash signature verification
    },
  },
]);

export default routes;
