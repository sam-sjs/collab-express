const express = require('express');
const mongoose = require('mongoose');
const projectsController = require('./controllers/projectsController');
const cors = require('cors');
const app = express();

app.use(cors());

// Setup database and connect
const mongoDB = 'mongodb://127.0.0.1/collab';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

// Store the default connection and bind error event
const db = mongoose.connection
db.on('error', err => console.log('Connection error:', err));

// Start listening on port 8000
const server = app.listen(8000, () => {
  console.log('Listening at 127.0.0.1:8000...');
});

// Route endpoints
app.get('/flights', projectsController.index);
