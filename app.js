const express = require('express');
const {
  handleCustomErrors,
  handleServerErrors,
} = require('./controllers/errors.controllers');
const { getTopics } = require('./controllers/topics.controllers');
const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'route not found' });
});

// Error handling middleware

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
