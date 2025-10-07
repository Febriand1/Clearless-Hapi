/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.createTable('authentications', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    token: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('authentications');
};
