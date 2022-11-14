const db = require('../db/connection.js');

exports.fetchArticles = () => {
  return db
    .query(
      `
        SELECT article_id, title, articles.author, topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        USING (article_id)
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`
    )
    .then((res) => {
      return res.rows;
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
        SELECT * 
        FROM articles
        WHERE article_id = $1;`,
      [article_id]
    )
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({ status: 404, msg: 'id not found' });
      } else return res.rows[0];
    });
};
