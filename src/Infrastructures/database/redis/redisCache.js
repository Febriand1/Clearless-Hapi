import { Redis } from '@upstash/redis';

class RedisCache {
  constructor() {
    this._redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  async get(key) {
    const result = await this._redis.get(key);
    if (result === null) throw new Error('Cache tidak ditemukan');

    return JSON.parse(result);
  }

  async set(key, value, expirationInSecond = 3600) {
    await this._redis.set(key, JSON.stringify(value), {
      EX: expirationInSecond,
    });
  }

  async delete(key) {
    await this._redis.del(key);
  }
}

export default RedisCache;
