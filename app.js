const express = require('express');
const app = express();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your process.env'
}

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

let conn = mongoose.connection;
conn.on('connected', function () {
  console.log('Mongoose connected to DB');

  require('./api/middlewares')(app);

  app.use(require('./api/middlewares/checkJwt'));
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
});

conn.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

conn.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

console.log('DB');
console.log(`${process.env.DB_URL}/${process.env.DB_NAME}`);

mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`, { server: { socketOptions: { keepAlive: 1 } } });

process.on('SIGINT', function() {
  conn.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});

module.exports = app;
