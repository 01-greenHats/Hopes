'use-strict';

module.exports = (err, req, res, next) => {
  console.log('i am the error');
  res.status(500).json({ err: err });
  next();
};