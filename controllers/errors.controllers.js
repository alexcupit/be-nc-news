exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'input uses invalid data type' });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log('unhandled error: ', err);
  res.status(500).send({ msg: 'internal server error!' });
};
