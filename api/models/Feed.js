const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FeedSchema = new Schema({
  author : String,
  link: String,
  type: String,
  data: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

FeedSchema.statics = {
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

module.exports = mongoose.model('Feed', FeedSchema);