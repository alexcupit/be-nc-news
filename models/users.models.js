const db = require('../db/connection');

exports.fetchUsers = async () => {
  const { rows: users } = await db.query(
    `
        SELECT * FROM users;`
  );
  return users;
};

exports.fetchUsersByUsername = async (username) => {
  const {
    rows: [user],
  } = await db.query(
    `
  SELECT username, name, avatar_url
  FROM users
  WHERE username = $1`,
    [username]
  );

  if (!user) {
    return Promise.reject({ status: 404, msg: 'username not found' });
  } else {
    return user;
  }
};
