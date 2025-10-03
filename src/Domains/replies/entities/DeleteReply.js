class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, commentId, replyId, owner } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.replyId = replyId;
    this.owner = owner;
  }

  _verifyPayload({ threadId, commentId, replyId, owner }) {
    if (!threadId || !commentId || !replyId) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PARAMETER');
    }

    if (
      typeof commentId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof replyId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default DeleteReply;
