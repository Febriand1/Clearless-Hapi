class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, commentId, owner } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({ threadId, commentId, owner }) {
    if (!threadId || !commentId) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PARAMETER');
    }

    if (
      typeof commentId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default DeleteComment;
