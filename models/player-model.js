const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username required!']
  },
  role: {
    type: String,
    default: 'villager'
  },
  lifeStatus: {
    type: String,
    default: 'alive'
  }
});

module.exports = mongoose.model('player', playerSchema);