const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const likesPlugin = require('mongoose-likes');

let FeedSchema = new Schema({
  author : { type: Schema.Types.ObjectId, ref: 'Account' },
  link: String,
  type: String,
  data: Schema.Types.Mixed,
  added: { type: Date, default: Date.now }
});

FeedSchema.plugin(likesPlugin, {
  disableDislikes: true
});

const Feed = mongoose.model('Feed', FeedSchema);

module.exports = () => {

  let add = (data, callback) => {
    let feed = new Feed(data);
    feed.save(callback);
  };

  let findById = (feedId, callback) => {
    Feed
      .findOne({_id:feedId})
      .populate('author', 'nickname')
      .exec(callback);
  };

  return {
    findById: findById,
    add: add,
    model: Feed
  }
};