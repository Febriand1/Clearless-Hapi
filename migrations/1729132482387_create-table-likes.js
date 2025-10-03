/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    likeable_id: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    likeable_type: {
      type: 'VARCHAR(20)',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.addConstraint('likes', 'fk_likes_user_id_users', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  pgm.addConstraint('likes', 'unique_user_likeable', {
    unique: ['user_id', 'likeable_id', 'likeable_type'],
  });
};

export const down = (pgm) => {
  pgm.dropConstraint('likes', 'fk_likes_user_id_users');
  pgm.dropConstraint('likes', 'unique_user_likeable');
  pgm.dropTable('likes');
};
