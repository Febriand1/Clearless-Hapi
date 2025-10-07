import InvariantError from '../../Commons/exceptions/InvariantError.js';
import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository.js';

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addToken(token) {
    const id = `token-${this._idGenerator(10)}`;
    await this._pool.query(
      'INSERT INTO authentications (id, token) VALUES ($1, $2)',
      [id, token],
    );
  }

  async checkAvailabilityToken(token) {
    const result = await this._pool.query(
      'SELECT * FROM authentications WHERE token = $1',
      [token],
    );

    if (result.rows.length === 0) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteToken(token) {
    await this._pool.query('DELETE FROM authentications WHERE token = $1', [
      token,
    ]);
  }
}

export default AuthenticationRepositoryPostgres;
