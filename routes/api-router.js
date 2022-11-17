const apiRouter = require('express').Router();
const { readFile } = require('fs/promises');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');

apiRouter.get('', (req, res) => {
  readFile(`${__dirname}/../endpoints.json`, 'utf-8').then((endpoints) => {
    res.status(200).send({ endpoints: JSON.parse(endpoints) });
  });
});

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
