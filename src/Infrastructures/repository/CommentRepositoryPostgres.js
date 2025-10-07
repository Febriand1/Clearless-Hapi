import Comment from '../../Domains/comments/entities/Comment.js';
import CommentRepository from '../../Domains/comments/CommentRepository.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getCommentOwnerById(commentId) {
    const result = await this._pool.query(
      'SELECT owner FROM comments WHERE id = $1',
      [commentId],
    );

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return result.rows[0].owner;
  }

  async addComment(addComments) {
    const { content, owner, threadId } = addComments;
    const id = `comment-${this._idGenerator(10)}`;
    const createdAt = new Date().toISOString();

    const result = await this._pool.query(
      'INSERT INTO comments (id, content, thread_id, created_at, owner) VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
      [id, content, threadId, createdAt, owner],
    );

    return new Comment(result.rows[0]);
  }

  async deleteComment(commentId) {
    await this._pool.query(
      'UPDATE comments SET is_delete = true WHERE id = $1',
      [commentId],
    );

    return true;
  }

  async getCommentByThreadId(threadId) {
    const result = await this._pool.query(
      `
        SELECT c.id, u.username, u.avatar, c.created_at AS date, c.is_delete, c.content
        FROM comments c
        JOIN users u ON c.owner = u.id
        WHERE c.thread_id = $1
        ORDER BY date ASC
      `,
      [threadId],
    );

    return result.rows;
  }

  async verifyCommentBelongsToThread({ commentId, threadId }) {
    const result = await this._pool.query(
      'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      [commentId, threadId],
    );

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return true;
  }

  async verifyAvailableComment(commentId) {
    const result = await this._pool.query(
      'SELECT id FROM comments WHERE id = $1',
      [commentId],
    );

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return true;
  }
}

export default CommentRepositoryPostgres;
