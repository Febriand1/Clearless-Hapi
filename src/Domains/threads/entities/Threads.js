class Threads {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      title,
      body,
      date,
      username,
      avatar,
      likeCount,
      isLiked,
      commentCount,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.avatar = avatar || null;
    this.likeCount = likeCount || 0;
    this.isLiked = !!isLiked;
    this.commentCount = commentCount || 0;
  }

  _verifyPayload({ id, title, body, date, username, avatar }) {
    if (!id || !title || !body || !username || !date) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof username !== 'string'
    ) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (avatar !== undefined && avatar !== null && typeof avatar !== 'string') {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default Threads;
