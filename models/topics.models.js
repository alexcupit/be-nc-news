const db = require('../db/connection.js');

exports.fetchTopics = () => {
  return db.query('SELECT * FROM topics;').then((res) => {
    return res.rows;
  });
};

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
