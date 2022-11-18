const db = require('../db/connection.js');

exports.fetchTopics = async () => {
  const { rows: topics } = await db.query('SELECT * FROM topics;');
  return topics;
};

exports.insertTopic = async (body) => {
  const { slug, description } = body;
  const {
    rows: [topic],
  } = await db.query(
    `
    INSERT INTO topics
      (slug, description)
    VALUES
      ($1, $2)
    RETURNING *;`,
    [slug, description]
  );
  return topic;
};
