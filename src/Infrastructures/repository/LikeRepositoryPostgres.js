import LikeRepository from '../../Domains/likes/LikeRepository.js';

const likesCache = new Map();

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(newLike) {
    const { userId, likeableId, likeableType } = newLike;
    const id = `like-${this._idGenerator()}`;

    const result = await this._pool.query(
      `
        INSERT INTO likes (id, user_id, likeable_id, likeable_type)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `,
      [id, userId, likeableId, likeableType],
    );
    return result.rows[0].id;
  }

  async deleteLike({ userId, likeableId, likeableType }) {
    await this._pool.query(
      `
        DELETE FROM likes
        WHERE user_id = $1 AND likeable_id = $2 AND likeable_type = $3
      `,
      [userId, likeableId, likeableType],
    );
    return true;
  }

  async checkLikeAvailability({ userId, likeableId, likeableType }) {
    const result = await this._pool.query(
      `
        SELECT 1 FROM likes
        WHERE user_id = $1 AND likeable_id = $2 AND likeable_type = $3
    `,
      [userId, likeableId, likeableType],
    );
    return result.rows[0];
  }

  async countLikes({ likeableId, likeableType }) {
    const key = `${likeableType}:${likeableId}`;
    const now = Date.now();

    // cache 30 detik
    if (likesCache.has(key)) {
      const { value, timestamp } = likesCache.get(key);
      if (now - timestamp < 30000) return value;
    }

    const result = await this._pool.query(
      'SELECT COUNT(*) AS likes FROM likes WHERE likeable_id = $1 AND likeable_type = $2',
      [likeableId, likeableType],
    );

    const count = parseInt(result.rows[0].likes, 10);
    likesCache.set(key, { value: count, timestamp: now });

    return count;
  }
}

export default LikeRepositoryPostgres;
