const db = require('../db/connection.js');
const { fetchArticleById } = require('./articles.models.js');

exports.fetchCommentsByArticleId = (article_id) => {
  return fetchArticleById(article_id)
    .then(() => {
      return db.query(
        `
    SELECT comment_id, body, author, votes, created_at
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`,
        [article_id]
      );
    })
    .then((res) => {
      return res.rows;
    });
};

exports.insertCommentByArticleId = (article_id, author, body) => {
  return db
    .query(
      `
    INSERT INTO comments
        (body, author, article_id, votes)
    VALUES
        ($3, $2, $1, 0)
    RETURNING*;
    `,
      [article_id, author, body]
    )
    .then((res) => {
      return res.rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`,
      [comment_id]
    )
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({ status: 404, msg: 'id not found' });
      } else return res;
    });
};
