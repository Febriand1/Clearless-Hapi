class DeleteThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, owner } = payload;

    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload({ threadId, owner }) {
    if (!threadId || !owner) {
      throw new Error('DELETE_THREAD.NOT_CONTAIN_NEEDED_PARAMETER');
    }

    if (typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default DeleteThread;
