const Project = require('../models/Project')
const User = require('../models/User')

module.exports = {
  // Project routes
  async index(req, res) {
    try {
      const projects = await Project.find();
      res.json(projects);
    } catch(error) {
      console.log('ERROR querying DB for projects index');
      res.sendStatus(500);
    }
  },

  async show(req, res) {
    try {
      const project = await Project.findOne({_id: req.params.id})
      .populate('projectLead')
      .populate('projectMembers');
      res.json(project);
    } catch(error) {
      console.log('ERROR querying DB for project show');
      res.sendStatus(500);
    }
  },

  async create(req, res) {
    try {
      const project = await Project.create({
        name: req.body.name,
        description: req.body.description,
        catagory: req.body.catagory,
        projectLead: req.user._id,
        projectMembers: [],
        lookingFor: req.body.lookingFor,
        image: req.body.image
      });
      const user = await User.findOneAndUpdate(
        {_id: req.user._id},
        {
          $push: {
            leadOn: project._id
          }
        }
      );
      res.json(project);
    } catch(error) {
      console.log('ERROR creating new project');
      res.sendStatus(500);
    }
  }
} // module.exports
