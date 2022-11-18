const db = require('../db/connection.js');

exports.fetchArticles = async (
  topic,
  sort_by = 'created_at',
  order = 'DESC',
  limit = 10,
  p = 1
) => {
  const validColumns = [
    'title',
    'topic',
    'author',
    'body',
    'votes',
    'created_at',
    'article_id',
    'comment_count',
  ];
  const validOrders = ['ASC', 'DESC'];
  let queryValues = [];
  let countQueryValues = [];

  if (!validColumns.includes(sort_by.toLowerCase())) {
    return Promise.reject({ status: 400, msg: 'invalid sort_by query' });
  }

  if (!validOrders.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: 'order must be asc or desc' });
  }

  let queryStr = `
    SELECT article_id, title, articles.author, topic, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    USING (article_id)`;

  if (topic) {
    queryValues.push(topic.toLowerCase());
    queryStr += ` WHERE topic = $1`;
  }

  queryStr += ` 
    GROUP BY articles.article_id
    ORDER BY articles.${sort_by.toLowerCase()} ${order}`;

  const { rowCount: total_count } = await db.query(queryStr, queryValues);

  if (/^\d+$/.test(+limit)) {
    queryValues.push(+limit);
  } else {
    return Promise.reject({ status: 400, msg: 'invalid limit query' });
  }

  if (/^\d+$/.test(+p)) {
    queryValues.push(+p);
  } else {
    return Promise.reject({ status: 400, msg: 'invalid page query' });
  }

  queryStr += topic
    ? ` LIMIT $2 OFFSET (($3 - 1) * $2);`
    : ` LIMIT $1 OFFSET (($2 - 1) * $1);`;

  const { rows: articles } = await db.query(queryStr, queryValues);

  return { total_count, articles };
};

exports.fetchArticleById = async (article_id) => {
  const {
    rows: [article],
  } = await db.query(
    `
        SELECT article_id, title, articles.author, topic, articles.body, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        USING (article_id)
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
    [article_id]
  );

  if (!article) {
    return Promise.reject({ status: 404, msg: 'id not found' });
  } else return article;
};

exports.updateArticleById = async (article_id, inc_votes) => {
  await this.fetchArticleById(article_id);

  const {
    rows: [article],
  } = await db.query(
    `
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;`,
    [article_id, inc_votes]
  );

  return article;
};

exports.insertArticle = async (postedBody) => {
  const { username: author, body, title, topic } = postedBody;
  const {
    rows: [{ article_id }],
  } = await db.query(
    `
    INSERT INTO articles
      (author, body, title, topic, votes)
    VALUES
      ($1, $2, $3, $4, 0)
    RETURNING article_id;`,
    [author, body, title, topic]
  );
  return article_id;
};

exports.removeArticleById = async (article_id) => {
  const {
    rows: [article],
  } = await db.query(
    `
    DELETE FROM articles
    WHERE article_id = $1
    RETURNING *;`,
    [article_id]
  );

  if (!article) {
    return Promise.reject({ status: 404, msg: 'id not found' });
  }
};
