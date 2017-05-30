const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.json({
    v: require('../package.json').version
  });
});

router.get('/private', (req, res) => {
  res.json({
    message: "Hello from a private endpoint!"
  });
});

module.exports = router