const express = require('express');

const {
  handleCustomErrors,
  handleServerErrors,
  handlePSQLErrors,
} = require('./controllers/errors.controllers');

const {
  getArticles,
  getArticleById,
  patchArticleById,
} = require('./controllers/articles.controllers');

const { getTopics } = require('./controllers/topics.controllers');

const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require('./controllers/comments.controllers');

const { getUsers } = require('./controllers/users.controllers');
const { endpoints } = require('./endpoints');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.get('/api/users', getUsers);

app.patch('/api/articles/:article_id', patchArticleById);

app.delete('/api/comments/:comment_id', deleteCommentById);

app.get('/api', (req, res) => {
  res.status(200).send(endpoints);
});

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'route not found' });
});

// Error handling middleware

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleServerErrors);

module.exports = app;
