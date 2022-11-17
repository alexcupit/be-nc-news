const {
  fetchArticles,
  fetchArticleById,
  updateArticleById,
  insertArticle,
} = require('../models/articles.models');

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  const validQueryKeys = ['topic', 'sort_by', 'order'];
  const queryKeys = Object.keys(req.query);
  if (
    !queryKeys.every((key) => {
      return validQueryKeys.includes(key);
    })
  ) {
    res.status(400).send({ msg: 'invalid query key' });
  } else {
    fetchArticles(topic, sort_by, order)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  }
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  insertArticle(req.body)
    .then((article_id) => {
      fetchArticleById(article_id).then((article) => {
        res.status(200).send({ article });
      });
    })
    .catch(next);
};
