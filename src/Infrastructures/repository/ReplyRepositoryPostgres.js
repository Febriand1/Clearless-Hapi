import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import Reply from '../../Domains/replies/entities/Reply.js';
import ReplyRepository from '../../Domains/replies/ReplyRepository.js';

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getReplyOwnerById(replyId) {
    const result = await this._pool.query(
      'SELECT owner FROM replies WHERE id = $1',
      [replyId],
    );

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    return result.rows[0].owner;
  }

  async addReply(addReplies) {
    const { content, owner, commentId } = addReplies;
    const id = `reply-${this._idGenerator(10)}`;
    const createdAt = new Date().toISOString();

    const result = await this._pool.query(
      `
      INSERT INTO replies (id, content, comment_id, owner, created_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, content, owner
    `,
      [id, content, commentId, owner, createdAt],
    );

    return new Reply(result.rows[0]);
  }

  async deleteReply(ReplyId) {
    await this._pool.query(
      'UPDATE replies SET is_delete = true WHERE id = $1',
      [ReplyId],
    );

    return true;
  }

  async getReplyByCommentId(commentId) {
    const result = await this._pool.query(
      `SELECT r.id, r.content, r.created_at AS date, u.username, u.avatar, r.is_delete
            FROM replies r
            JOIN users u ON r.owner = u.id
            WHERE r.comment_id = $1
            ORDER BY date ASC`,
      [commentId],
    );

    return result.rows;
  }

  async verifyReplyBelongsToComment({ replyId, commentId }) {
    const result = await this._pool.query(
      'SELECT id FROM replies WHERE id = $1 AND comment_id = $2',
      [replyId, commentId],
    );

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    return true;
  }

  async verifyAvailableReply(replyId) {
    const result = await this._pool.query(
      'SELECT id FROM replies WHERE id = $1',
      [replyId],
    );

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    return true;
  }
}

export default ReplyRepositoryPostgres;
