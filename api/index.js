const express = require('express');
const router = express.Router();
const Feed = require('./models/Feed');

router.get('/', function (req, res) {
  res.json({
    v: require('../package.json').version,
    message: "Hello from a public endpoint!"
  });
});

router.get('/private', (req, res) => {
  res.json({
    message: "Hello from a private endpoint!",
    user: req.user
  });
});

router.get('/feed', (req, res) => {
  const { limit = 50, skip = 0 } = req.query;
  Feed.list({ limit, skip })
    .then(feeds => res.json(feeds))
    .catch(e => next(e));
});

router.post('/feed', (req, res, next) => {
  console.log(req.body);
  const feed = new Feed(req.body);

  feed.save()
    .then(savedFeed => res.json(savedFeed))
    .catch(e => next(e));
});

module.exports = router;