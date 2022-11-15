const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
} = require('../models/comments.models');

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username: author, body } = req.body;
  insertCommentByArticleId(article_id, author, body)
    .then((newComment) => {
      res.status(201).send({ comment: newComment });
    })
    .catch(next);
};
