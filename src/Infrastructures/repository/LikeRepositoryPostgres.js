import LikeRepository from '../../Domains/likes/LikeRepository.js';

class LikeRepositoryPostgres extends LikeRepository {
  constructor(db, idGenerator) {
    super();
    this._sql = db;
    this._idGenerator = idGenerator;
  }

  async addLike(newLike) {
    const { userId, likeableId, likeableType } = newLike;
    const id = `like-${this._idGenerator()}`;

    const [result] = await this._sql`
      INSERT INTO likes (id, user_id, likeable_id, likeable_type)
      VALUES (${id}, ${userId}, ${likeableId}, ${likeableType})
      RETURNING id
    `;

    return result;
  }

  async deleteLike({ userId, likeableId, likeableType }) {
    await this._sql`
      DELETE FROM likes
      WHERE user_id = ${userId} AND likeable_id = ${likeableId} AND likeable_type = ${likeableType}
    `;

    return true;
  }

  async checkLikeAvailability({ userId, likeableId, likeableType }) {
    const [result] = await this._sql`
      SELECT id FROM likes
      WHERE user_id = ${userId} AND likeable_id = ${likeableId} AND likeable_type = ${likeableType}
    `;

    return result;
  }

  async countLikes({ likeableId, likeableType }) {
    const [result] = await this._sql`
      SELECT COUNT(*) AS likes
        FROM likes
      WHERE likeable_id = ${likeableId} AND likeable_type = ${likeableType}
    `;

    const likeCount = parseInt(result.likes, 10);

    return likeCount;
  }
}

export default LikeRepositoryPostgres;
