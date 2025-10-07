class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, isDelete, avatar } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.isDelete = !!isDelete;
    this.content = this.isDelete ? '**komentar telah dihapus**' : content;
    this.avatar = avatar || null;
  }

  _verifyPayload({ id, username, date, content, avatar }) {
    if (!id || !username || !date || !content) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof content !== 'string' ||
      !(date instanceof Date)
    ) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (avatar !== undefined && avatar !== null && typeof avatar !== 'string') {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default CommentDetail;
