const express = require('express');
const mongoose = require('mongoose');
const projectsController = require('./controllers/projectsController');
const usersController = require('./controllers/usersController');
const cors = require('cors');
const app = express();

// Authentication
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtAuthenticate = require('express-jwt');
const crypto = require('crypto');
const toHash = 'ThisIsAStringOfNonsenseToBeTurnedIntoAServerKeyHAHAHAHA'
SERVER_SECRET_KEY = crypto.createHash('md5').update(toHash).digest('hex');

// Handler function for protected routes
const checkAuth = () => {
  return jwtAuthenticate({
    secret: SERVER_SECRET_KEY,
    algorithms: ['HS256']
  });
}

app.use(cors());
app.use(express.json());

// Setup database and connect
const mongoDB = 'mongodb://127.0.0.1/collab';
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// Store the default connection and bind error event
const db = mongoose.connection
db.on('error', err => console.log('Connection error:', err));

// Start listening on port 8000
const server = app.listen(8000, () => {
  console.log('Listening at 127.0.0.1:8000...');
});

// Route endpoints
app.get('/flights', projectsController.index);
app.post('/users/create', usersController.create);
app.post('/user', checkAuth(), usersController.show);
app.patch('/user/update', usersController.update);

// Authentication route
app.post('/login', async (req, res) => {
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
      console.log('User:', user);
      res.json({user, token});
    } else {
      res.sendStatus(401);
    }
  } catch(error) {
    console.log('Login error', req.body, error);
    res.sendStatus(500);
  }
})
