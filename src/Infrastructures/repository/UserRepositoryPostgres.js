import InvariantError from '../../Commons/exceptions/InvariantError.js';
import RegisteredUser from '../../Domains/users/entities/RegisteredUser.js';
import UserRepository from '../../Domains/users/UserRepository.js';

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username) {
    const result = await this._pool.query(
      'SELECT username FROM users WHERE username = $1',
      [username],
    );
    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser(registerUser) {
    const { username, password, fullname, email, avatar } = registerUser;
    const id = `user-${this._idGenerator(10)}`;

    const result = await this._pool.query(
      'INSERT INTO users (id, username, password, fullname, email, avatar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, fullname, email, avatar',
      [id, username, password, fullname, email, avatar],
    );

    return new RegisteredUser({ ...result.rows[0] });
  }

  async getPasswordByUsername(username) {
    const result = await this._pool.query(
      'SELECT password FROM users WHERE username = $1',
      [username],
    );

    if (!result.rowCount) {
      throw new InvariantError('username tidak ditemukan');
    }

    return result.rows[0].password;
  }

  async getIdByUsername(username) {
    const result = await this._pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username],
    );

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }

  async getUserById(userId) {
    const result = await this._pool.query(
      'SELECT id, username, fullname, email, avatar FROM users WHERE id = $1',
      [userId],
    );

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    return result.rows[0];
  }

  async updateUser(userId, { fullname, email, avatar }) {
    const setClauses = [];
    const values = [];

    if (fullname !== undefined) {
      values.push(fullname);
      setClauses.push(`fullname = $${values.length}`);
    }
    if (email !== undefined) {
      values.push(email);
      setClauses.push(`email = $${values.length}`);
    }
    if (avatar !== undefined) {
      values.push(avatar);
      setClauses.push(`avatar = $${values.length}`);
    }

    if (setClauses.length === 0) {
      throw new InvariantError('UPDATE_USER.NO_FIELD_PROVIDED');
    }

    values.push(userId);

    const result = await this._pool.query(
      `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${
        values.length
      } RETURNING id, username, fullname, email, avatar`,
      values,
    );

    if (!result.rowCount) {
      throw new Error('USER_REPOSITORY.USER_NOT_FOUND');
    }

    return result.rows[0];
  }
}

export default UserRepositoryPostgres;
