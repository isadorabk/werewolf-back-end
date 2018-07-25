const mongoose = require('mongoose');

mongoose.connect(
  'mongodb://127.0.0.1:27017/werewolf-solo-project', {
    useNewUrlParser: true
  },
  err => {
    // eslint-disable-next-line
    if (err) console.error('Connection error: ', err);
    // eslint-disable-next-line
    else console.log('MongoDb connected on port 27017');
  }
);