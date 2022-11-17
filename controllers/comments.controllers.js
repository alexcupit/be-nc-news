const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
  updateCommentByCommentId,
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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentByCommentId(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
