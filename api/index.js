const express = require('express');
const api = express.Router();

api.get('/feed', (req, res)=>{
  res.json(req.user)
});

api.use('/users', require('./controllers/User'));
api.use('/feeds', require('./controllers/Feed'));

module.exports = api;