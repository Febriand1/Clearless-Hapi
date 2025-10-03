import InvariantError from '../../Commons/exceptions/InvariantError.js';
import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository.js';

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor(db) {
    super();
    this._sql = db;
  }

  async addToken(token) {
    await this._sql`INSERT INTO authentications (token) VALUES (${token})`;
  }

  async checkAvailabilityToken(token) {
    const [result] = await this
      ._sql`SELECT * FROM authentications WHERE token = ${token}`;

    if (!result) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteToken(token) {
    await this._sql`DELETE FROM authentications WHERE token = ${token}`;
  }
}

export default AuthenticationRepositoryPostgres;
