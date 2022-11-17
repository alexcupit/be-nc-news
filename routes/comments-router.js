const {
  deleteCommentById,
  patchCommentByCommentId,
} = require('../controllers/comments.controllers');

const commentsRouter = require('express').Router();

commentsRouter
  .route('/:comment_id')
  .delete(deleteCommentById)
  .patch(patchCommentByCommentId);

module.exports = commentsRouter;
