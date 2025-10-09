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

  async verifyAvailableEmail(email) {
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase() : email;
    const result = await this._pool.query(
      'SELECT email FROM users WHERE email = $1',
      [normalizedEmail],
    );
    if (result.rowCount) {
      throw new InvariantError('email sudah digunakan');
    }
  }

  async addUser(registerUser, verificationPayload = {}) {
    const { username, password, fullname, email, avatar } = registerUser;
    const {
      codeHash = null,
      expiresAt = null,
      isVerified = false,
    } = verificationPayload;
    const id = `user-${this._idGenerator(10)}`;

    const result = await this._pool.query(
      `INSERT INTO users (
        id,
        username,
        password,
        fullname,
        email,
        avatar,
        is_email_verified,
        email_verification_code,
        email_verification_expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, username, fullname, email, avatar, is_email_verified`,
      [
        id,
        username,
        password,
        fullname,
        email,
        avatar,
        isVerified,
        codeHash,
        expiresAt,
      ],
    );

    return new RegisteredUser({ ...result.rows[0] });
  }

  async getPasswordByUsername(username) {
    const result = await this._pool.query(
      `SELECT id, password, is_email_verified
      FROM users
      WHERE username = $1`,
      [username],
    );

    if (!result.rowCount) {
      throw new InvariantError('username tidak ditemukan');
    }

    return result.rows[0];
  }

  async getIdByUsername(username) {
    const result = await this._pool.query(
      `SELECT id, is_email_verified
      FROM users
      WHERE username = $1`,
      [username],
    );

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }

  async getUserByEmail(email) {
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase() : email;
    const result = await this._pool.query(
      `SELECT
        id,
        username,
        fullname,
        email,
        avatar,
        is_email_verified,
        email_verification_code,
        email_verification_expires_at,
        email_verified_at
      FROM users
      WHERE email = $1`,
      [normalizedEmail],
    );

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    return result.rows[0];
  }

  async getUserById(userId) {
    const result = await this._pool.query(
      `SELECT
        id,
        username,
        fullname,
        email,
        avatar,
        is_email_verified
      FROM users
      WHERE id = $1`,
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
      } RETURNING id, username, fullname, email, avatar, is_email_verified`,
      values,
    );

    if (!result.rowCount) {
      throw new Error('USER_REPOSITORY.USER_NOT_FOUND');
    }

    return result.rows[0];
  }

  async verifyUserEmail(userId) {
    const result = await this._pool.query(
      `UPDATE users
      SET
        is_email_verified = true,
        email_verification_code = NULL,
        email_verification_expires_at = NULL,
        email_verified_at = NOW()
      WHERE id = $1
      RETURNING id, username, fullname, email, avatar, is_email_verified`,
      [userId],
    );

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteUserById(userId) {
    await this._pool.query('DELETE FROM users WHERE id = $1', [userId]);
  }
}

export default UserRepositoryPostgres;
