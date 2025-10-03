import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import Reply from '../../Domains/replies/entities/Reply.js';
import ReplyRepository from '../../Domains/replies/ReplyRepository.js';

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(db, idGenerator) {
    super();
    this._sql = db;
    this._idGenerator = idGenerator;
  }

  async getReplyOwnerById(replyId) {
    const [row] = await this
      ._sql`SELECT owner FROM replies WHERE id = ${replyId}`;

    if (!row) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    return row.owner;
  }

  async addReply(addReplies) {
    const { content, owner, commentId } = addReplies;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const [result] = await this._sql`
      INSERT INTO replies (id, content, comment_id, owner, created_at)
      VALUES (${id}, ${content}, ${commentId}, ${owner}, ${createdAt})
      RETURNING id, content, owner
    `;

    return new Reply(result);
  }

  async deleteReply(replyId) {
    await this._sql`
      UPDATE replies
      SET is_delete = true
      WHERE id = ${replyId}
    `;

    return true;
  }

  async getReplyByCommentId(commentId) {
    const results = await this._sql`
      SELECT replies.id, replies.content, replies.created_at AS date, users.username, replies.is_delete
      FROM replies
      JOIN users ON replies.owner = users.id
      WHERE replies.comment_id = ${commentId}
      ORDER BY date ASC
    `;

    return results;
  }

  async verifyAvailableReply(replyId) {
    const [row] = await this._sql`SELECT id FROM replies WHERE id = ${replyId}`;

    if (!row) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    return true;
  }
}

export default ReplyRepositoryPostgres;
