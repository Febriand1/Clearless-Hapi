import { Redis } from '@upstash/redis';
import { config } from '../../../Utils/config.js';

class CacheRedis {
  constructor() {
    const url = config.upstash.redisUrl;
    const token = config.upstash.redisToken;

    this._isEnabled = !!url && !!token;
    this._memoryCache = new Map();
    this._defaultExpiration = 1800;
    this._memoryExpiration =
      Number(config.upstash.ttl) > 0 ? Number(config.upstash.ttl) : 10;

    if (this._isEnabled) {
      this.redis = new Redis({
        url,
        token,
      });
    } else {
      this.redis = null;
    }
  }

  _getFromMemory(key) {
    const cached = this._memoryCache.get(key);
    if (!cached) return null;
    if (cached.expireAt < Date.now()) {
      this._memoryCache.delete(key);
      return null;
    }
    return cached.value;
  }

  _setMemory(key, value, ttl) {
    const expireAt = Date.now() + ttl * 1000;
    this._memoryCache.set(key, { value, expireAt });
  }

  async get(key) {
    const memoryValue = this._getFromMemory(key);
    if (memoryValue !== null) return memoryValue;

    if (!this._isEnabled) {
      throw new Error('Cache tidak ditemukan');
    }

    const result = await this.redis.get(key);
    if (result === null) throw new Error('Cache tidak ditemukan');

    this._setMemory(key, result, this._memoryExpiration);
    return result;
  }

  async set(
    key,
    value,
    expirationInSecond = this._defaultExpiration,
    memoryExpirationInSecond = Math.min(
      this._memoryExpiration,
      expirationInSecond,
    ),
  ) {
    if (this._isEnabled) {
      await this.redis.set(key, value, {
        ex: expirationInSecond,
      });
    }

    this._setMemory(key, value, memoryExpirationInSecond);
  }

  async delete(key) {
    this._memoryCache.delete(key);
    if (!this._isEnabled) return;
    await this.redis.del(key);
  }
}

export default CacheRedis;
