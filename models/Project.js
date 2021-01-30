const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  catagory: String,
  projectLead: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'User'
  },
  projectMembers: [{
    type: mongoose.Schema.Types.ObjectID,
    ref: 'User'
  }],
  lookingFor: Array,
  image: String
});

module.exports = mongoose.model('Project', ProjectSchema);
