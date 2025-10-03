import Comment from '../../Domains/comments/entities/Comment.js';
import CommentRepository from '../../Domains/comments/CommentRepository.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class CommentRepositoryPostgres extends CommentRepository {
  constructor(db, idGenerator) {
    super();
    this._sql = db;
    this._idGenerator = idGenerator;
  }

  async getCommentOwnerById(commentId) {
    const [row] = await this
      ._sql`SELECT owner FROM comments WHERE id = ${commentId}`;

    if (!row) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return row.owner;
  }

  async addComment(addComments) {
    const { content, owner, threadId } = addComments;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const [result] = await this._sql`
      INSERT INTO comments (id, content, thread_id, created_at, owner)
      VALUES (${id}, ${content}, ${threadId}, ${createdAt}, ${owner})
      RETURNING id, content, owner
    `;

    return new Comment(result);
  }

  async deleteComment(commentId) {
    await this._sql`
      UPDATE comments
      SET is_delete = true
      WHERE id = ${commentId}
    `;

    return true;
  }

  async getCommentByThreadId(threadId) {
    const results = await this._sql`
      SELECT comments.id, users.username, comments.created_at AS date, comments.is_delete, comments.content
      FROM comments
      JOIN users ON comments.owner = users.id
      WHERE comments.thread_id = ${threadId}
      ORDER BY date ASC
    `;

    return results;
  }

  async verifyAvailableComment(commentId) {
    const [row] = await this
      ._sql`SELECT id FROM comments WHERE id = ${commentId}`;

    if (!row) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return true;
  }
}

export default CommentRepositoryPostgres;
