const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your process.env'
}

app.use(cors());
app.use(morgan('API Request: :method :url :status :response-time ms - :res[content-length]'));

//app.use(require('./api/middlewares/checkJwt'));
//app.use(require('./api/middlewares/checkScopes')([ 'read:users' ]));

app.use('/api', require('./api'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    "message": err.message,
    "error": req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
