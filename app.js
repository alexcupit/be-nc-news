const express = require('express');
const cors = require('cors');

const {
  handleCustomErrors,
  handleServerErrors,
  handlePSQLErrors,
} = require('./controllers/errors.controllers');

const apiRouter = require('./routes/api-router');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'route not found' });
});

// Error handling middleware

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleServerErrors);

module.exports = app;
