const db = require('../db/connection.js');
const { fetchArticleById } = require('./articles.models.js');

exports.fetchCommentsByArticleId = async (article_id, limit = 10, p = 1) => {
  await fetchArticleById(article_id);

  const { rows: comments } = await db.query(
    `
    SELECT comment_id, body, author, votes, created_at
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET (($3-1)*$2);`,
    [article_id, limit, p]
  );

  return comments;
};

exports.insertCommentByArticleId = async (article_id, author, body) => {
  const {
    rows: [comment],
  } = await db.query(
    `
    INSERT INTO comments
        (body, author, article_id, votes)
    VALUES
        ($3, $2, $1, 0)
    RETURNING*;
    `,
    [article_id, author, body]
  );
  return comment;
};

exports.removeCommentById = async (comment_id) => {
  const res = await db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`,
    [comment_id]
  );

  if (!res.rows.length) {
    return Promise.reject({ status: 404, msg: 'id not found' });
  } else return res;
};

exports.updateCommentByCommentId = async (comment_id, inc_votes) => {
  const {
    rows: [comment],
  } = await db.query(
    `
    UPDATE comments
    SET votes = votes + $2
    WHERE comment_id = $1
    RETURNING *;`,
    [comment_id, inc_votes]
  );

  if (!comment) {
    return Promise.reject({ status: 404, msg: 'id not found' });
  } else {
    return comment;
  }
};
