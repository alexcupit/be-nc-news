const { fetchTopics, insertTopic } = require('../models/topics.models');

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.postTopic = (req, res, next) => {
  insertTopic(req.body)
    .then((topic) => {
      res.status(200).send({ topic });
    })
    .catch(next);
};
