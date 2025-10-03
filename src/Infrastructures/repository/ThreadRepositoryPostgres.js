import Thread from '../../Domains/threads/entities/Thread.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(db, idGenerator) {
    super();
    this._sql = db;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableThread(threadId) {
    const [row] = await this
      ._sql`SELECT id FROM threads WHERE id = ${threadId}`;

    if (!row) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return true;
  }

  async addThread(addThread) {
    const { title, body, owner } = addThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const [result] = await this._sql`
      INSERT INTO threads (id, title, body, owner, created_at)
      VALUES (${id}, ${title}, ${body}, ${owner}, ${createdAt})
      RETURNING id, title, owner
    `;

    return new Thread(result);
  }

  async getThreadById(threadId) {
    const [result] = await this._sql`
      SELECT threads.id, threads.title, threads.body, threads.created_at AS date, users.username
      FROM threads
      JOIN users ON threads.owner = users.id
      WHERE threads.id = ${threadId}
    `;

    if (!result) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return result;
  }

  async getAllThreads() {
    const [result] = await this._sql`
      SELECT threads.id, threads.title, threads.body, threads.created_at AS date, users.username
      FROM threads
      JOIN users ON threads.owner = users.id
      ORDER BY threads.created_at DESC
    `;

    return result;
  }

  async getAllThreadsWithPagination({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const [countResult] = await this._sql`SELECT COUNT(*) AS total FROM threads`;
    const total = parseInt(countResult.total, 10);

    const rows = await this._sql`
    SELECT t.id, t.title, t.body, t.created_at AS date, u.username
    FROM threads t
    JOIN users u ON t.owner = u.id
    ORDER BY t.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

    return { rows, total };
  }
}

export default ThreadRepositoryPostgres;
