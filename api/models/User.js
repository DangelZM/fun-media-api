const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  socialId:  { type: String, unique: true },
  nickname:  { type: String, unique: true },
  photoUrl:  { type: String }
});

module.exports = mongoose.model('User', UserSchema);