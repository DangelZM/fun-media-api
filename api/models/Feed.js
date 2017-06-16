const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedSchema = new Schema({
  author : { type: Schema.Types.ObjectId, ref: 'User' },
  link: String,
  type: String,
  data: Schema.Types.Mixed,
  added: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feed', FeedSchema);