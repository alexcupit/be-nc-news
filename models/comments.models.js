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
