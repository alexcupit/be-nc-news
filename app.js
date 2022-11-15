const express = require('express');

const {
  handleCustomErrors,
  handleServerErrors,
  handlePSQLErrors,
} = require('./controllers/errors.controllers');

const {
  getArticles,
  getArticleById,
} = require('./controllers/articles.controllers');

const { getTopics } = require('./controllers/topics.controllers');

const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require('./controllers/comments.controllers');

const { getUsers } = require('./controllers/users.controllers');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.get('/api/users', getUsers);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'route not found' });
});

// Error handling middleware

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleServerErrors);

module.exports = app;
