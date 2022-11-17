const {
  getArticles,
  getArticleById,
  patchArticleById,
  postArticle,
} = require('../controllers/articles.controllers');
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require('../controllers/comments.controllers');
const articles = require('../db/data/test-data/articles');

const articlesRouter = require('express').Router();

articlesRouter.route('/').get(getArticles).post(postArticle);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
