const User = require('../models/User')

module.exports = {
  // User routes
  async create(req, res) {
    try {
      const user = await User.create(
        {
          name: req.body.params.name,
          email: req.body.params.email,
          image: req.body.params.image,
          skills: req.body.params.tags
        }
      );
      res.json(user);
    } catch(error) {
      console.log('ERROR querying DB for users create');
      res.sendStatus(500);
    }
  },

  async show(req, res) {
    try {
      const user = await User.findOne({_id: req.user._id})
      .populate('leadOn')
      .populate('memberOn');
      res.json(user);
    } catch(error) {
      console.log('ERROR querying DB for user show');
      res.sendStatus(500);
    }
  },

  async update(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        {_id: req.body.params._id},
        {
          name: req.body.params.name,
          email: req.body.params.email,
          image: req.body.params.image,
          skills: req.body.params.tags
        },
        {new: true}
      )
      .populate('leadOn')
      .populate('memberOn');
      res.json(user);
    } catch(error) {
      console.log('ERROR patching DB for user update');
      res.sendStatus(500);
    }
  }
} // module.exports
