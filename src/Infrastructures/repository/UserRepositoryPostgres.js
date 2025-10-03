import InvariantError from '../../Commons/exceptions/InvariantError.js';
import RegisteredUser from '../../Domains/users/entities/RegisteredUser.js';
import UserRepository from '../../Domains/users/UserRepository.js';

class UserRepositoryPostgres extends UserRepository {
  constructor(db, idGenerator) {
    super();
    this._sql = db;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username) {
    const results = await this
      ._sql`SELECT username FROM users WHERE username = ${username}`;
    if (results.length > 0) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser(registerUser) {
    const { username, password, fullname, email, avatar } = registerUser;
    const id = `user-${this._idGenerator()}`;

    const [result] = await this._sql`
      INSERT INTO users (id, username, password, fullname, email, avatar)
      VALUES (${id}, ${username}, ${password}, ${fullname}, ${email}, ${avatar})
      RETURNING id, username, fullname, email, avatar
    `;

    return new RegisteredUser({ ...result });
  }

  async getPasswordByUsername(username) {
    const [row] = await this
      ._sql`SELECT password FROM users WHERE username = ${username}`;
    if (!row) {
      throw new InvariantError('username tidak ditemukan');
    }
    return row.password;
  }

  async getIdByUsername(username) {
    const [row] = await this
      ._sql`SELECT id FROM users WHERE username = ${username}`;
    if (!row) {
      throw new InvariantError('user tidak ditemukan');
    }
    return row.id;
  }

  async getUserById(userId) {
    const [row] = await this
      ._sql`SELECT id, username, fullname, email, avatar FROM users WHERE id = ${userId}`;

    if (!row) {
      throw new InvariantError('user tidak ditemukan');
    }

    return row;
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

    const query = `
    UPDATE users
    SET ${setClauses.join(', ')}
    WHERE id = $${values.length}
    RETURNING id, username, fullname, email, avatar
  `;

    const resultArray = await this._sql.query(query, values);
    const result = resultArray[0];

    if (!result) {
      throw new Error('USER_REPOSITORY.USER_NOT_FOUND');
    }

    return result;
  }
}

export default UserRepositoryPostgres;
