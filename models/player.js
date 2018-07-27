const Game = require('../models/game');
const randomstring = require('randomstring');
const players = {};

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
    // Game.addPlayer(players[playerId]);
    return players[playerId];
  }

  constructor (playerId, username, role, lifeStatus) {
    this.playerId = playerId;
    this.username = username;
    this.role = role;
    this. lifeStatus = lifeStatus;
  }


}

module.exports = Player;