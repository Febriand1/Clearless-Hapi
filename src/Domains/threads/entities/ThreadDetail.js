class ThreadDetail {
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
      commentCount,
      isLiked,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.avatar = avatar || null;
    this.likeCount = likeCount;
    this.commentCount = commentCount;
    this.isLiked = isLiked;
  }

  _verifyPayload(payload) {
    const requiredProperties = [
      'id',
      'title',
      'body',
      'date',
      'username',
      'likeCount',
      'commentCount',
      'isLiked',
    ];

    const missingProperty = requiredProperties.find(
      (property) => payload[property] === undefined,
    );

    if (missingProperty) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const {
      id,
      title,
      body,
      date,
      username,
      avatar,
      likeCount,
      commentCount,
      isLiked,
    } = payload;

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof username !== 'string' ||
      !(date instanceof Date) ||
      typeof likeCount !== 'number' ||
      typeof commentCount !== 'number' ||
      typeof isLiked !== 'boolean'
    ) {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (avatar !== undefined && avatar !== null && typeof avatar !== 'string') {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default ThreadDetail;
