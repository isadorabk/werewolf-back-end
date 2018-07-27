const randomstring = require('randomstring');

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
    if (!game.gameId) throw new Error('Game does not exist.');
    if (game.adminCode !== adminCode) throw new Error('Invalid admin code.');
    game.admin = socket;
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