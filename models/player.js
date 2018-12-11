const randomstring = require('randomstring');
const players = {};
const card = require('./card');

class Player {
  static get (playerId) {
    return players[playerId];
  }

  static create (name) {
    const playerId = randomstring.generate(10);
    const username = name;
    const role = 'villager';
    const lifeStatus = 'alive';
    players[playerId] = new Player(playerId, username, role, lifeStatus);
    return players[playerId];
  }

  constructor (playerId, username, role, lifeStatus) {
    this.playerId = playerId;
    this.username = username;
    this.role = role;
    this.lifeStatus = lifeStatus;
    this.card = card;
    this.winner = false;
    this.toVote = 'vote';
    this.votes = 0;
  }

}

module.exports = Player;