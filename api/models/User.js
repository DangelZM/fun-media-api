const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  user_id: String,
  name: String,
  lastname: String,
  createdAt: { type: Date, default: Date.now }
});

UserSchema.statics = {

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

module.exports = mongoose.model('User', UserSchema);