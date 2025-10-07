import Thread from '../../Domains/threads/entities/Thread.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableThread(threadId) {
    const result = await this._pool.query(
      'SELECT id FROM threads WHERE id = $1 AND is_delete = false',
      [threadId],
    );

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return true;
  }

  async addThread(addThread) {
    const { title, body, owner } = addThread;
    const id = `thread-${this._idGenerator(10)}`;
    const createdAt = new Date().toISOString();

    const result = await this._pool.query(
      'INSERT INTO threads (id, title, body, owner, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner',
      [id, title, body, owner, createdAt],
    );

    return new Thread(result.rows[0]);
  }

  async getThreadById(threadId) {
    const result = await this._pool.query(
      `SELECT t.id, t.title, t.body, t.created_at AS date, u.username, u.avatar
            FROM threads t
            JOIN users u ON t.owner = u.id
            WHERE t.id = $1 AND t.is_delete = false`,
      [threadId],
    );

    return result.rows[0];
  }

  async getAllThreads() {
    const result = await this._pool.query(
      `
        SELECT t.id, t.title, t.body, t.created_at AS date, u.username, u.avatar
            FROM threads t
            JOIN users u ON t.owner = u.id
            WHERE t.is_delete = false
            ORDER BY t.created_at DESC
      `,
      [],
    );

    return result.rows;
  }

  async getAllThreadsWithPagination({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const countResult = await this._pool.query(
      'SELECT COUNT(*) AS total FROM threads WHERE is_delete = false',
      [],
    );
    const total = parseInt(countResult.rows[0].total, 10);

    const result = await this._pool.query(
      `SELECT t.id, t.title, t.body, t.created_at AS date, u.username, u.avatar
            FROM threads t
            JOIN users u ON t.owner = u.id
            WHERE t.is_delete = false
            ORDER BY t.created_at DESC
            LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    return { rows: result.rows, total };
  }

  async getThreadOwnerById(threadId) {
    const result = await this._pool.query(
      'SELECT owner FROM threads WHERE id = $1 AND is_delete = false',
      [threadId],
    );

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return result.rows[0].owner;
  }

  async deleteThread(threadId) {
    const result = await this._pool.query(
      'DELETE FROM threads WHERE id = $1 AND is_delete = false RETURNING id',
      [threadId],
    );

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return true;
  }
}

export default ThreadRepositoryPostgres;
