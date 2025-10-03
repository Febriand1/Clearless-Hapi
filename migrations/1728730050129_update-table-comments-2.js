/* eslint-disable camelcase */

export const up = (pgm) => {
  pgm.addColumns('comments', {
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumns('comments', 'is_delete');
};
