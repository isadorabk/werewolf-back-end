const randomstring = require('randomstring');
const Player = require('../models/player');
const games = {};
const card = require('../models/card');

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
    player.card = card;
    if (!game.players) game.players = {};
    game.players[userId] = player;
  }

  static getPlayers (gameId) {
    const game = Game.get(gameId);
    if (!game) throw new Error('Game does not exist.');
    const players = game.players;
    let playersArr = [];
    for (let key in players) {
      if (players.hasOwnProperty(key)) {
        let { socket, ...player } = players[key];
        player.socketId = players[key].socket.id;
        playersArr.push(player);
      }
    }
    const playersRole = Game.assignWerewolves(playersArr, gameId);
    return playersRole;
  }

  constructor (gameId, adminCode) {
    this.gameId = gameId;
    this.adminCode = adminCode;
    this.round = 'waiting';
  }

  log () {
    const { gameId, adminCode } = this;
    return JSON.stringify({
      gameId,
      adminCode,
      admin: this.admin ? this.admin.id : null
    });
  }

  static assignWerewolves (data, gameId) {
    let playersRole = data.slice();
    const numOfPlayers = playersRole.length;
    const werewolvesRatio = 4;
    const numOfWerewolves = Math.floor(numOfPlayers / werewolvesRatio);
    const werewolves = Game.getRandomElements(playersRole, numOfWerewolves);
    playersRole.forEach(player => {
      werewolves.forEach(werewolf => {
        if (werewolf.playerId === player.playerId) player.role = 'werewolf';
      });
    });
    werewolves.forEach(element => {
      const playerId = element.playerId;
      const game = Game.get(gameId);
      game.players[playerId].role = 'werewolf';
    });
    return playersRole;
  }

  static getRandomElements (arr, n) {
    let result = new Array(n);
    let len = arr.length;
    let taken = new Array(len);
    if (n > len) throw new RangeError('getRandomElements: more elements taken than avaiable');
    while (n--) {
      let x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

}

module.exports = Game;