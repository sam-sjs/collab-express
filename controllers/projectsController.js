const Project = require('../models/Project')

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
  }
} // module.exports
