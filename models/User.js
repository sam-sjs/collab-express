const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  skills: Array
});

module.exports = mongoose.model('User', UserSchema);
