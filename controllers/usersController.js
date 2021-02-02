const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
        {_id: req.user._id},
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
  },

  async delete(req, res) {
    try {
      const user = await User.findOne({_id: req.user._id});
      if(user && bcrypt.compareSync(req.body.password, user.passwordDigest)) {
        await User.deleteOne({_id: req.user._id});
        res.sendStatus(200);
      } else {
        console.log('Delete Failed Here');
        res.sendStatus(401);
      }
    } catch(error) {
      console.log('ERROR deleting user from DB');
      res.sendStatus(500);
    }
  },

  async login(req, res) {
    const {email, password} = req.body;
    try {
      const user = await User.findOne({email});
      if(user && bcrypt.compareSync(password, user.passwordDigest)) {
        const token = jwt.sign(
          {
            _id: user._id,
            name: user.name,
            email: user.email
          },
          SERVER_SECRET_KEY,
          {expiresIn: '24h'}
        );
        res.json({user, token});
      } else {
        res.sendStatus(401);
      }
    } catch(error) {
      console.log('Login error', req.body, error);
      res.sendStatus(500);
    }
  }
} // module.exports
