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
    if (!games[gameId]) {
      const adminCode = randomstring.generate(12);
      games[gameId] = new Game(gameId, adminCode);
      return games[gameId];
    } else return this.createGame();
  }

  static setAdmin (gameId, adminCode, socket) {
    const game = Game.get(gameId);
    // if (!game) throw new Error('Game does not exist.');
    if (!game) return;
    if (game.adminCode !== adminCode) throw new Error('Invalid admin code.');
    game.admin = socket;
  }

  static addPlayer (gameCode, userId, socket) {
    const game = Game.get(gameCode);
    // if (!game) throw new Error('Game does not exist.');
    if (!game) return;
    const player = Player.get(userId);
    player.socket = socket;
    if (!game.players) game.players = {};
    game.players[userId] = player;
    return game.players[userId];
  }

  static updatePlayerSocket (gameCode, userId, socket) {
    const game = Game.get(gameCode);
    if (!game) return;
    const player = Player.get(userId);
    if (!player) return;
    player.socket = socket;
    if (!game.players) game.players = {};
    game.players[userId] = player;
  }

  static assignRoles (gameId) {
    const game = Game.get(gameId);
    // if (!game) throw new Error('Game does not exist.');
    if (!game) return;
    let playersArr = [];
    for (let id in game.players) {
      if (game.players.hasOwnProperty(id)) {
        let { socket, ...player } = game.players[id];
        player.socketId = game.players[id].socket.id;
        playersArr.push(player);
      }
    }
    // if (playersArr.length < 5) throw new Error('Not enough players');
    Game.assignWerewolves(playersArr, gameId);
    Game.assignSpecialRoles(gameId);
  }

  static setStarted (gameId) {
    const game = Game.get(gameId);
    game.started = true;
  }

  static startRound (gameId, round) {
    const game = Game.get(gameId);
    game.round = round;
  }

  static killPlayer (gameId, playerId) {
    const game = Game.get(gameId);
    for (let id in game.players) {
      if (game.players.hasOwnProperty(id)) {
        if (game.players[id].playerId === playerId) {
          game.players[id].lifeStatus = 'dead';
          return game.players[id];
        }
      }
    }
  }

  static checkGameFinished (gameId) {
    const players = Game.get(gameId).players;
    let villagersAlive = 0;
    let werewolvesAlive = 0;
    for (const id in players) {
      if (players.hasOwnProperty(id)) {
        if (players[id].lifeStatus === 'alive') {
          if (players[id].role === 'werewolf') werewolvesAlive++;
          else villagersAlive++;
        }
      }
    }
    if (werewolvesAlive === 0) {
      for (const id in players) {
        if (players.hasOwnProperty(id)) {
          if (players[id].role !== 'werewolf' && players[id].lifeStatus === 'alive') players[id].winner = true;
        }
      }
      return true;
    }
    if (werewolvesAlive === villagersAlive) {
      for (const id in players) {
        if (players.hasOwnProperty(id)) {
          if (players[id].role === 'werewolf' && players[id].lifeStatus === 'alive') players[id].winner = true;
        }
      }
      return true;
    }
    else return false;
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
    for (let id in game.players) {
      if (game.players.hasOwnProperty(id)) {
        numOfPlayers++;
        if (game.players[id].role === 'villager') villagersArr.push(game.players[id]);
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