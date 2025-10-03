class ThreadId {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, date, username, comments, likeCount, isLiked } =
      payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.likeCount = likeCount || 0;
    this.isLiked = !!isLiked;
    this.comments = comments || [];
  }

  _verifyPayload({ id, title, body, date, username }) {
    if (!id || !title || !body || !date || !username) {
      throw new Error('THREAD_ID.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof username !== 'string' ||
      !(date instanceof Date)
    ) {
      throw new Error('THREAD_ID.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  addComment(comment) {
    this.comments.push(comment);
  }
}

export default ThreadId;
