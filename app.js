const express = require('express');
const {
  handleCustomErrors,
  handleServerErrors,
} = require('./controllers/errors.controllers');
const { getTopics, getArticles } = require('./controllers/topics.controllers');
const app = express();

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'route not found' });
});

// Error handling middleware

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;