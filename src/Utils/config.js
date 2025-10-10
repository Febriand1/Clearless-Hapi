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
  email: {
    from: process.env.EMAIL_FROM,
    verificationSubject: process.env.EMAIL_VERIFICATION_SUBJECT,
    verificationTtlMinutes: process.env.EMAIL_VERIFICATION_TTL_MINUTES
      ? Number(process.env.EMAIL_VERIFICATION_TTL_MINUTES)
      : 10,
  },
  qstash: {
    token: process.env.QSTASH_TOKEN,
    baseUrl: process.env.QSTASH_URL,
    emailTargetUrl: process.env.QSTASH_EMAIL_TARGET_URL,
    emailTopic: process.env.QSTASH_EMAIL_TOPIC,
    emailHeaders: safeJsonParse(process.env.QSTASH_EMAIL_HEADERS),
  },
};

function safeJsonParse(value) {
  if (!value) {
    return undefined;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    return undefined;
  }
}
