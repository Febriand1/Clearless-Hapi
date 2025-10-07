export const config = {
  server: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  neon: {
    pgUrl: process.env.DATABASE_URL,
  },
  tokenize: {
    accessToken: process.env.ACCESS_TOKEN_KEY,
    refreshToken: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
  },
  vercel: {
    blob: process.env.BLOB_READ_WRITE_TOKEN,
  },
  upstash: {
    redisUrl: process.env.UPSTASH_REDIS_REST_URL,
    redisToken: process.env.UPSTASH_REDIS_REST_TOKEN,
    ttl: process.env.CACHE_MEMORY_TTL_SECONDS,
  },
};
