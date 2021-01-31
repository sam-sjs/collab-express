const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  skills: Array,
  image: String,
  leadOn: [{
    type: mongoose.Schema.Types.ObjectID,
    ref: 'Project'
  }],
  memberOn: [{
    type: mongoose.Schema.Types.ObjectID,
    ref: 'Project'
  }]
});

module.exports = mongoose.model('User', UserSchema);
