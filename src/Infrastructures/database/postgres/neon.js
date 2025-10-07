/* istanbul ignore file */
import { Pool } from '@neondatabase/serverless';
import { config } from '../../../Utils/config.js';

if (!config.neon.pgUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({
  connectionString: config.neon.pgUrl,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

export default pool;
