/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.addColumns('users', {
    email: {
      type: 'VARCHAR(255)',
      notNull: false,
      unique: true,
    },
    avatar: {
      type: 'TEXT',
      notNull: false,
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumns('users', ['email', 'avatar']);
};
