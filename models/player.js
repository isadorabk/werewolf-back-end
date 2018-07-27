const randomstring = require('randomstring');
const players = {};

class Player {
  static get (userId) {
    return players[userId];
  }

  static create (name) {
    const userId = randomstring.generate(10);
    const username = name;
    const role = 'villager';
    const lifeStatus = 'alive';
    players[userId] = new Player(userId, username, role, lifeStatus);
    return players[userId];
  }

  constructor (userId, username, role, lifeStatus) {
    this.userId = userId;
    this.username = username;
    this.role = role;
    this. lifeStatus = lifeStatus;
  }


}

module.exports = Player;