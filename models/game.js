const randomstring = require('randomstring');
const Player = require('../models/player');
const games = {};

class Game {
  static get (gameId) {
    return games[gameId];
  }

  static createGame () {
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
    return game.players[userId];
  }

  static assignRoles (gameId) {
    const game = Game.get(gameId);
    if (!game) throw new Error('Game does not exist.');
    let playersArr = [];
    for (let key in game.players) {
      if (game.players.hasOwnProperty(key)) {
        let { socket, ...player } = game.players[key];
        player.socketId = game.players[key].socket.id;
        playersArr.push(player);
      }
    }
    if (playersArr.length < 5) throw new Error('Not enough players');
    Game.assignWerewolves(playersArr, gameId);
    Game.assignSpecialRoles(gameId);
  }

  static startRound (gameId, round) {
    const game = Game.get(gameId);
    game.round = round;
  }

  static killPlayer (gameId, playerId) {
    const game = Game.get(gameId);
    for (let key in game.players) {
      if (game.players.hasOwnProperty(key)) {
        if (game.players[key].playerId === playerId) {
          game.players[key].lifeStatus = 'dead';
          return {
            playerId,
            socketId: game.players[key].socket.id,
            lifeStatus: game.players[key].lifeStatus
          };
        }
      }
    }
  }

  constructor (gameId, adminCode) {
    this.gameId = gameId;
    this.adminCode = adminCode;
    this.round = 'waiting game to start';
  }

  log () {
    const { gameId, adminCode } = this;
    return JSON.stringify({
      gameId,
      adminCode,
      admin: this.admin ? this.admin.id : null
    });
  }

  static assignWerewolves (players, gameId) {
    const numOfPlayers = players.length;
    const werewolvesRatio = 5;
    const numOfWerewolves = Math.floor(numOfPlayers / werewolvesRatio);
    const werewolves = Game.getRandomElements(players, numOfWerewolves);
    werewolves.forEach(werewolf => {
      const playerId = werewolf.playerId;
      const game = Game.get(gameId);
      game.players[playerId].role = 'werewolf';
    });
  }

  static assignSpecialRoles (gameId) {
    const game = Game.get(gameId);
    let villagersArr = [];
    let numOfPlayers = 0;
    for (let key in game.players) {
      if (game.players.hasOwnProperty(key)) {
        numOfPlayers++;
        if (game.players[key].role === 'villager') villagersArr.push(game.players[key]);
      }
    }
    const seersDocsRatio = 10;
    const numOfSeers = Math.ceil(numOfPlayers / seersDocsRatio);
    const numOfDoctors = numOfSeers;
    const seers = Game.getRandomElements(villagersArr, numOfSeers);
    let newVillagersArr = [];
    villagersArr.forEach(villager => {
      seers.forEach(seer => {
        if (seer.playerId === villager.playerId) villager.role = 'seer';
      });
      if (villager.role !== 'seer') newVillagersArr.push(villager);
    });
    const doctors = Game.getRandomElements(newVillagersArr, numOfDoctors);
    seers.forEach(seer => {
      const playerId = seer.playerId;
      game.players[playerId].role = 'seer';
    });
    doctors.forEach(doctor => {
      const playerId = doctor.playerId;
      game.players[playerId].role = 'doctor';
    });

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