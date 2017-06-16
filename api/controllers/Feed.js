const http = require('http');
const https = require('https');
const url = require('url');

const express = require('express');
const feed = express.Router();

const Feed = require('../models/Feed')();

const _ = require('underscore');
const videoUrlParser = require('videoUrlParser');
const imageType = require('image-type');


const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];

feed.get('/', function(req, res) {
  Feed.model
    .find({}, '-password', {sort: '-added'})
    .populate('author', 'nickname')
    .exec(function(err, feeds){
      if(err) return res.send(500, 'Ошибка: ошибка базы данных');
      console.log(feeds);
      res.json(feeds);
    });
});

feed.get('/:id', function(req, res) {
  let feedId = (req.params.id === 'me')
    ? req.decoded.user.id
    : req.params.id;

  Feed.findById(feedId, function(feed) {
    res.json(feed);
  });
});

feed.post('/add',  function (req, res) {
  processFeedType(req.body.link, function(err, result){
    if(err) return res.send(500, err);

    Feed.add({
      author: req.decoded.user.id,
      link: req.body.link,
      type: result.type,
      data: result.data
    }, function (err, newFeed) {
      if(err) return res.send(500, 'Ошибка');
      console.log('Сохранили фид');
      console.log(newFeed);
      Feed.findById(newFeed._id, function(err, feed) {
        console.log('фид: ', feed);
        res.json(feed);
      });
    })

  });
});

function processFeedType(link, cb){
  var result = {};
  var protocol = url.parse(link).protocol;
  var hostname = url.parse(link).hostname;

  var client;
  if(protocol === "http:"){
    client = http;
  } else if(protocol === "https:") {
    client = https;
  } else {
    cb("Not supported protocol!");
  }

  if(hostname.indexOf('www.') != -1){
    hostname = hostname.replace('www.', '');
  }
  if(_.contains(__videoHosts, hostname)){
    var data = videoUrlParser.parse(link);
    if(data) {
      delete data.mediaType;
      result.type = 'video';
      result.data = data;
    } else {
      cb("Not video link");
    }
    cb(null, result);
  } else {
    //cb(null, {type: 'image', data: {}});
    console.log(link);
    client.get(link, function (res) {
      res.once('data', function (chunk) {
        res.destroy();
        console.log(imageType(chunk));
        var linkInfo = imageType(chunk);

        if (allowedMimes.indexOf(linkInfo.mime) == -1 ) {
          cb("Not supported type!");
        } else {
          result.type = 'image';
          result.data = linkInfo;
          cb(null, result);
        }
      });
    });
  }
}

module.exports = feed;