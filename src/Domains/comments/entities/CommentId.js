class CommentId {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      content,
      username,
      date,
      likeCount,
      isDelete,
      isLiked,
      replies,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
    this.likeCount = likeCount;
    this.isLiked = !!isLiked;
    this.replies = replies || [];
  }

  _verifyPayload({ id, username, date, content }) {
    if (!id || !username || !date || !content) {
      throw new Error('COMMENT_ID.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      !(date instanceof Date) ||
      typeof content !== 'string'
    ) {
      throw new Error('COMMENT_ID.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  addReply(reply) {
    this.replies.push(reply);
  }
}

export default CommentId;
