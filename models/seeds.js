const mongoose = require('mongoose');
const Project = require('./Project');
const User = require('./User');

// Setup database and connect
const mongoDB = 'mongodb://127.0.0.1/collab';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

// Store the default connection and bind error event
const db = mongoose.connection
db.on('error', err => console.log('Connection error:', err));

// Open connection and seed data
db.once('open', async () => {
  try {
    await User.deleteMany({});
    await Project.deleteMany({});
    await User.create([
      {
        name: 'John Doe',
        email: 'john.doe@fakeemail.com',
        skills: ['Graphic Designer', 'Project Manager']
      },
      {
        name: 'Papa Smurf',
        email: 'gopapa@bluestuff.com',
        skills: ['Writer', 'Photographer']
      },
      {
        name: 'Bob T. Builder',
        email: 'bob@construction.com',
        skills: ['Javascript Developer', 'Python Developer']
      }
    ]);
    const users = await User.find();
    await Project.create([
      {
        name: 'Space Game',
        description: 'The perfect web based space exploration game!',
        catagory: 'Game development',
        projectLead: users[2]._id,
        projectMembers: [users[0], users[1]],
        lookingFor: ['Writer', 'Graphic Designer'],
        image: 'http://www.placekitten.com/250/250'
      },
      {
        name: 'The Cabin in the Woods',
        description: 'Cabins and monsters and young people',
        catagory: 'Movie',
        projectLead: users[1]._id,
        projectMemberes: [users[0], users[2]],
        lookingFor: ['Sound Engineer', 'Actor'],
        image: 'http://www.placekitten.com/300/300'
      },
      {
        name: 'CollaborMate',
        description: 'The greatest app ever developed for the web',
        catagory: 'Web application',
        projectLead: users[0]._id,
        projectMemebers: [],
        lookingFor: ['Javascript Developer'],
        image: 'http://www.placekitten.com/200/200'
      }
    ])
  } catch(error) {
    console.log('ERROR:', error);
  }

  // Print newly seeded data
  const users = await User.find();
  console.log('Users', users);

  const projects = await Project.find();
  console.log('Projects', projects);

  process.exit(0);
});
