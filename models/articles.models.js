const db = require('../db/connection.js');

exports.fetchArticles = (
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

  let countQueryStr = `SELECT * FROM articles`;

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

  if (topic) {
    queryValues.push(topic.toLowerCase());
    queryStr += ` WHERE topic = $3`;
    countQueryValues.push(topic.toLowerCase());
    countQueryStr += ` WHERE topic = $1`;
  }

  queryStr += ` 
    GROUP BY articles.article_id
    ORDER BY articles.${sort_by.toLowerCase()} ${order}`;

  console.log(queryStr, queryValues);

  const countPromise = db.query(countQueryStr, countQueryValues).then((res) => {
    return res.rowCount;
  });

  queryStr += ` LIMIT $1 OFFSET (($2 - 1) * $1);`;

  const articlesPromise = db.query(queryStr, queryValues).then((res) => {
    return res.rows;
  });

  return Promise.all([countPromise, articlesPromise]).then(
    ([total_count, articles]) => {
      return { total_count, articles };
    }
  );
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
        SELECT article_id, title, articles.author, topic, articles.body, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        USING (article_id)
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`,
      [article_id]
    )
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({ status: 404, msg: 'id not found' });
      } else return res.rows[0];
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return this.fetchArticleById(article_id)
    .then(() => {
      return db.query(
        `
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;`,
        [article_id, inc_votes]
      );
    })
    .then((res) => res.rows[0]);
};

exports.insertArticle = (postedBody) => {
  const { username: author, body, title, topic } = postedBody;
  return db
    .query(
      `
    INSERT INTO articles
      (author, body, title, topic, votes)
    VALUES
      ($1, $2, $3, $4, 0)
    RETURNING article_id;`,
      [author, body, title, topic]
    )
    .then((res) => res.rows[0].article_id);
};

exports.removeArticleById = (article_id) => {
  return db
    .query(
      `
    DELETE FROM articles
    WHERE article_id = $1
    RETURNING *;`,
      [article_id]
    )
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({ status: 404, msg: 'id not found' });
      }
    });
};
