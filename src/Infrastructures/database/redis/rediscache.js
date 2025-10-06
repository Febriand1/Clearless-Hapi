import { Redis } from '@upstash/redis';

class RedisCache {
  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  async get(key) {
    const result = await this.redis.get(key);
    if (result === null) throw new Error('Cache tidak ditemukan');
    return result;
  }

  async set(key, value, expirationInSecond = 1800) {
    await this.redis.set(key, value, {
      ex: expirationInSecond,
    });
  }

  async delete(key) {
    await this.redis.del(key);
  }
}

export default RedisCache;
