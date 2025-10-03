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
      'SELECT id FROM threads WHERE id = $1',
      [threadId],
    );

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return true;
  }

  async addThread(addThread) {
    const { title, body, owner } = addThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const result = await this._pool.query(
      'INSERT INTO threads (id, title, body, owner, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner',
      [id, title, body, owner, createdAt],
    );

    return new Thread(result.rows[0]);
  }

  async getThreadById(threadId) {
    const result = await this._pool.query(
      `SELECT t.id, t.title, t.body, t.created_at AS date, u.username
            FROM threads t
            JOIN users u ON t.owner = u.id
            WHERE t.id = $1`,
      [threadId],
    );

    return result.rows[0];
  }

  async getAllThreads() {
    const result = await this._pool.query(
      `
        SELECT t.id, t.title, t.body, t.created_at AS date, u.username
            FROM threads t
            JOIN users u ON t.owner = u.id
            ORDER BY t.created_at DESC
      `,
      [],
    );

    return result.rows;
  }

  async getAllThreadsWithPagination({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const countResult = await this._pool.query(
      'SELECT COUNT(*) AS total FROM threads',
      [],
    );
    const total = parseInt(countResult.rows[0].total, 10);

    const result = await this._pool.query(
      `SELECT t.id, t.title, t.body, t.created_at AS date, u.username
            FROM threads t
            JOIN users u ON t.owner = u.id
            ORDER BY t.created_at DESC
            LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    return { rows: result.rows, total };
  }
}

export default ThreadRepositoryPostgres;
