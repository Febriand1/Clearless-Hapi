import LikeRepository from '../../Domains/likes/LikeRepository.js';

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator, cacheService) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._cacheService = cacheService;
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

    await this._cacheService.delete(`likeables:${likeableType}:${likeableId}`);

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

    await this._cacheService.delete(`likeables:${likeableType}:${likeableId}`);

    return true;
  }

  async checkLikeAvailability({ userId, likeableId, likeableType }) {
    const result = await this._pool.query(
      `
        SELECT 1 FROM likes
        WHERE user_id = $1 AND likeable_id = $2 AND likeable_type = $3
        LIMIT 1
    `,
      [userId, likeableId, likeableType],
    );
    return result.rowCount > 0;
  }

  async countLikes({ likeableId, likeableType }) {
    const cacheKey = `likeables:${likeableType}:${likeableId}`;

    try {
      const cachedResult = await this._cacheService.get(cacheKey);
      const { count } = JSON.parse(cachedResult);
      return count;
    } catch (error) {
      const result = await this._pool.query(
        'SELECT COUNT(*) AS likes FROM likes WHERE likeable_id = $1 AND likeable_type = $2',
        [likeableId, likeableType],
      );

      const count = parseInt(result.rows[0].likes, 10);

      await this._cacheService.set(
        cacheKey,
        JSON.stringify({ count }),
      );

      return count;
    }
  }
}

export default LikeRepositoryPostgres;