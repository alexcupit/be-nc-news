const db = require('../db/connection.js');

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
    SELECT comment_id, body, author, votes, created_at
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`,
      [article_id]
    )
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({ status: 404, msg: 'id not found' });
      } else return res.rows;
    });
};
