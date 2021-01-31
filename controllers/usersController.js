const User = require('../models/User')

module.exports = {
  // User routes
  async create(req, res) {
    try {
      const user = await User.create(
        {
          name: req.body.params.name,
          email: req.body.params.email,
          skills: req.body.params.tags
        }
      );
      res.json(user);
    } catch(error) {
      console.log('ERROR querying DB for users create');
      res.sendStatus(500);
    }
  }
} // module.exports
