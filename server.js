const express = require('express');
const mongoose = require('mongoose');
const projectsController = require('./controllers/projectsController');
const usersController = require('./controllers/usersController');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});

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

// Setup websocket connection & handle chat
io.on('connection', socket => {
  const NEW_CHAT_MESSAGE_EVENT = 'newChatMessage';
  console.log('user connected');
  // Join a conversation
  const {roomId} = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, data => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  // Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    socket.leave(roomId);
  });
});

// Start listening on port 8000
// const server = app.
server.listen(8000, () => {
  console.log('Listening at 127.0.0.1:8000...');
});

// Route endpoints
app.get('/user', checkAuth(), usersController.show);
app.post('/users/create', usersController.create);
app.patch('/user/update', checkAuth(), usersController.update);
app.post('/user/delete', checkAuth(), usersController.delete);
app.get('/projects', projectsController.index);
app.get('/project/:id', projectsController.show);
app.post('/projects/create', checkAuth(), projectsController.create);

// Authentication route
app.post('/login', usersController.login);
