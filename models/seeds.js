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

    // Create new users
    const u1 = new User({
      name: 'John Doe',
      email: 'john.doe@fakeemail.com',
      skills: ['Graphic Designer', 'Project Manager'],
      image: 'http://www.placecage.com/200/200'
    });
    const u2 = new User({
      name: 'Papa Smurf',
      email: 'gopapa@bluestuff.com',
      skills: ['Writer', 'Photographer'],
      image: 'http://www.placecage.com/200/200'
    });
    const u3 = new User({
      name: 'Bob T. Builder',
      email: 'bob@construction.com',
      skills: ['Javascript Developer', 'Python Developer'],
      image: 'http://www.placecage.com/200/200'
    });

    // Create new projects
    const space = new Project({
      name: 'Space Game',
      description: 'The perfect web based space exploration game!',
      catagory: 'Game development',
      lookingFor: ['Writer', 'Graphic Designer'],
      image: 'http://www.placekitten.com/250/250'
    });
    const cabin = new Project({
      name: 'The Cabin in the Woods',
      description: 'Cabins and monsters and young people',
      catagory: 'Movie',
      lookingFor: ['Sound Engineer', 'Actor'],
      image: 'http://www.placekitten.com/300/300'
    });
    const mate = new Project({
      name: 'CollaborMate',
      description: 'The greatest app ever developed for the web',
      catagory: 'Web application',
      projectMemebers: [],
      lookingFor: ['Javascript Developer'],
      image: 'http://www.placekitten.com/200/200'
    });

    // Setup associations
    space.projectLead = u3._id;
    space.projectMembers.push(u1._id, u2._id);
    await space.save();
    cabin.projectLead = u2._id;
    cabin.projectMembers.push(u1._id, u3._id);
    await cabin.save();
    mate.projectLead = u1._id;
    await mate.save();
    u1.leadOn = [mate._id];
    u1.memberOn = [space._id, cabin._id];
    await u1.save();
    u2.leadOn = [cabin._id];
    u2.memberOn = [space._id];
    await u2.save();
    u3.leadOn = [space._id];
    u3.memberOn = [cabin._id];
    await u3.save();
    
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
