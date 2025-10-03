class NewLike {
  constructor(payload) {
    this._verifyPayload(payload);

    const { userId, likeableId, likeableType } = payload;

    this.userId = userId;
    this.likeableId = likeableId;
    this.likeableType = likeableType;
  }

  _verifyPayload({ userId, likeableId, likeableType }) {
    if (!userId || !likeableId || !likeableType) {
      throw new Error('NEW_LIKE.NOT_CONTAIN_NEEDED_PARAMETER');
    }

    if (typeof userId !== 'string' || typeof likeableId !== 'string') {
      throw new Error('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const allowedTypes = ['thread', 'comment', 'reply'];
    if (!allowedTypes.includes(likeableType)) {
      throw new Error('NEW_LIKE.INVALID_TYPE');
    }
  }
}

export default NewLike;
