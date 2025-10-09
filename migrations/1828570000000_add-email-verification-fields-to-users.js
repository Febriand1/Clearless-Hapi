/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.addColumns('users', {
    is_email_verified: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
    email_verification_code: {
      type: 'TEXT',
      notNull: false,
    },
    email_verification_expires_at: {
      type: 'TIMESTAMP',
      notNull: false,
    },
    email_verified_at: {
      type: 'TIMESTAMP',
      notNull: false,
    },
  });

  pgm.sql(
    "UPDATE users SET is_email_verified = true, email_verified_at = NOW() WHERE email IS NOT NULL",
  );
};

export const down = (pgm) => {
  pgm.dropColumns('users', [
    'is_email_verified',
    'email_verification_code',
    'email_verification_expires_at',
    'email_verified_at',
  ]);
};
