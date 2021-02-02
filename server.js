const express = require('express');
const mongoose = require('mongoose');
const projectsController = require('./controllers/projectsController');
const usersController = require('./controllers/usersController');
const cors = require('cors');
const app = express();

// Authentication
const User = require('./models/User');
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
app.get('/user', checkAuth(), usersController.show);
app.patch('/user/update', checkAuth(), usersController.update);
app.post('/user/delete', checkAuth(), usersController.delete);

// Authentication route
app.post('/login', usersController.login);
