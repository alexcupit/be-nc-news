const db = require('../db/connection');

exports.fetchUsers = () => {
  return db
    .query(
      `
        SELECT * FROM users;`
    )
    .then((res) => res.rows);
};

exports.fetchUsersByUsername = (username) => {
  return db
    .query(
      `
  SELECT username, name, avatar_url
  FROM users
  WHERE username = $1`,
      [username]
    )
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({ status: 404, msg: 'username not found' });
      } else {
        return res.rows[0];
      }
    });
};
