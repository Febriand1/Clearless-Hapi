import AuthenticationTokenManager from '../../Applications/security/AuthenticationTokenManager.js';
import InvariantError from '../../Commons/exceptions/InvariantError.js';
import { config } from '../../Utils/config.js';

class JwtTokenManager extends AuthenticationTokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  async createAccessToken(payload) {
    return this._jwt.generate(payload, config.tokenize.accessToken);
  }

  async createRefreshToken(payload) {
    return this._jwt.generate(payload, config.tokenize.refreshToken);
  }

  async verifyRefreshToken(token) {
    try {
      const artifacts = this._jwt.decode(token);
      this._jwt.verify(artifacts, config.tokenize.refreshToken);
    } catch (error) {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token) {
    const artifacts = this._jwt.decode(token);
    return artifacts.decoded.payload;
  }
}

export default JwtTokenManager;
