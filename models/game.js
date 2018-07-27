const randomstring = require('randomstring');
const Player = require('../models/player');

const games = {};

class Game {
  static get (gameId) {
    return games[gameId];
  }

  static create () {
    const gameId = randomstring.generate({
      length: 4,
      charset: 'numeric'
    });
    const adminCode = randomstring.generate(12);
    games[gameId] = new Game(gameId, adminCode);
    return games[gameId];
  }

  static setAdmin (gameId, adminCode, socket) {
    const game = Game.get(gameId);
    if (!game) throw new Error('Game does not exist.');
    if (game.adminCode !== adminCode) throw new Error('Invalid admin code.');
    game.admin = socket;
  }

  static addPlayer (gameCode, userId, socket) {
    const game = Game.get(gameCode);
    if (!game) throw new Error('Game does not exist.');
    const player = Player.get(userId);
    player.socket = socket;
    if (!game.players) game.players = {};
    game.players[userId] = player;
  }

  constructor (gameId, adminCode) {
    this.gameId = gameId;
    this.adminCode = adminCode;
  }

  log () {
    const { gameId, adminCode } = this;
    return JSON.stringify({
      gameId,
      adminCode,
      admin: this.admin ? this.admin.id : null
    });
  }

}

module.exports = Game;