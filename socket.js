const IO = require('socket.io');
const chalk = require('chalk');
const Game = require('./models/game');
// const gameController = require('./controllers/game-controller');

// let io;

// module.exports.createSocket = (server) => {
//   io = IO(server);

//   io.on('connection', gameController.onConnection);
// };

// module.exports.io = io;
module.exports = (server) => {
  io = IO(server);

  io.on('connection', (socket) => {
    // eslint-disable-next-line
    console.log(chalk.bgGreen('User connected', socket.id));

    socket.on('disconnect', () => {
      //if admin disconnect --> game.resetgamerunning
      // eslint-disable-next-line
      console.log(chalk.bgRed('User disconnected', socket.id));
    });

    socket.on('createGame', (gameId, adminCode) => {
      Game.setAdmin(gameId, adminCode, socket);
      socket.join(gameId);
      // eslint-disable-next-line
      console.log(chalk.green(Game.get(gameId).log()));
    });

    socket.on('joinGame', (gameCode, userId) => {
      if (!gameCode) return;
      const player = Game.addPlayer(gameCode, userId, socket);
      socket.join(gameCode);
      let { socket: _, ...playerData } = player;
      socket.to(gameCode).emit('gameCommand', 'playerCreated', playerData);
    });

    socket.on('startGame', (gameId) => {
      Game.assignRoles(gameId);
      const game = Game.get(gameId);
      const players = game.players;
      let werewolves = [];
      let specialRoles = [];
      let villagers = [];
      for (let id in players) {
        if (players.hasOwnProperty(id)) {
          let { socket: _, ...playerInfo } = players[id];
          io.to(players[id].socket.id).emit('gameCommand', 'playerInfo', playerInfo);
          if (playerInfo.role === 'werewolf') werewolves.push(playerInfo);
          if (playerInfo.role !== 'werewolf' && playerInfo.role !== 'villager') specialRoles.push(playerInfo);
          if (playerInfo.role === 'villager') villagers.push(playerInfo);
        }
      }
      const allPlayers = {
        werewolves,
        specialRoles,
        villagers
      };
      io.to(game.admin.id).emit('gameCommand', 'playersList', allPlayers);
      // eslint-disable-next-line
      console.log(chalk.bgGreen('Game started: ', gameId));
    });

    socket.on('startRound', (gameId, round) => {
      // eslint-disable-next-line
      if (round === 'day') console.log(chalk.bgYellow('Day round: ', gameId));
      // eslint-disable-next-line
      if (round === 'night') console.log(chalk.bgBlue('Night round: ', gameId));
      Game.startRound(gameId, round);
      io.in(gameId).emit('gameCommand', 'updateRound', round);
    });

    socket.on('killPlayer', (gameId, playerId) => {
      const playerKilled = Game.killPlayer(gameId, playerId);
      const game = Game.get(gameId);
      let {
        socket: _,
        ...playerInfo
      } = playerKilled;
      io.to(playerKilled.socket.id).emit('gameCommand', 'updateLifeStatus', playerKilled.lifeStatus);
      io.to(game.admin.id).emit('gameCommand', 'updateLifeStatus', playerInfo);
      // eslint-disable-next-line
      console.log(chalk.bgMagenta('Kill player: ', playerId));
      const gameFinished = Game.checkGameFinished(gameId);
      if (gameFinished) {
        const players = Game.get(gameId).players;
        let playersAlive = [];
        let werewolves = [];
        let specialRoles = [];
        let villagers = [];
        for (let id in players) {
          if (players.hasOwnProperty(id)) {
            let { socket: _, ...playerInfo } = players[id];
            if (playerInfo.role === 'werewolf') werewolves.push(playerInfo);
            if (playerInfo.role !== 'werewolf' && playerInfo.role !== 'villager') specialRoles.push(playerInfo);
            if (playerInfo.role === 'villager') villagers.push(playerInfo);
            if (players[id].lifeStatus === 'alive') {
              playersAlive.push(playerInfo);
              io.to(players[id].socket.id).emit('gameCommand', 'gameEnd', playerInfo);
            }
          }
        }
        const allPlayers = { werewolves, specialRoles, villagers };
        io.to(game.admin.id).emit('gameCommand', 'gameEnd', allPlayers);
        // eslint-disable-next-line
        console.log(chalk.bgRed('Game finished: ', gameId));
      }
    });

    socket.on('startVote', gameId => {
      const players = Game.get(gameId).players;
      const playersAlive = [];
      for (let id in players) {
        if (players.hasOwnProperty(id)) {
          const { socket: _, ...playerInfo } = players[id];
          if (playerInfo.lifeStatus === 'alive') {
            playersAlive.push(playerInfo);
          }
        }
      }
      socket.to(gameId).emit('gameCommand', 'startVote', playersAlive);
    });

    socket.on('finishVote', gameId => {
      socket.to(gameId).emit('gameCommand', 'finishVote', false);
      const players = Game.get(gameId).players;
      for (let id in players) {
        if (players.hasOwnProperty(id)) {
          players[id].votes = 0;
        }
      }
    });

    socket.on('voteToKill', (gameId, playerId) => {
      const game = Game.get(gameId);
      const players = game.players;
      players[playerId].votes ++;
      const werewolves = [];
      const specialRoles = [];
      const villagers = [];
      for (let id in players) {
        if (players.hasOwnProperty(id)) {
          let { socket: _, ...playerInfo } = players[id];
          io.to(players[id].socket.id).emit('gameCommand', 'playerInfo', playerInfo);
          if (playerInfo.role === 'werewolf') werewolves.push(playerInfo);
          if (playerInfo.role !== 'werewolf' && playerInfo.role !== 'villager') specialRoles.push(playerInfo);
          if (playerInfo.role === 'villager') villagers.push(playerInfo);
        }
      }
      const allPlayers = {
        werewolves,
        specialRoles,
        villagers
      };

      io.to(game.admin.id).emit('gameCommand', 'updateVotes', allPlayers);
    });

  });

};

// //get allsockets in a room
// var clients_in_the_room = io.sockets.adapter.rooms[gameCode].sockets;
// for (var clientId in clients_in_the_room) { //the first is the admin
//   console.log('client: %s', clientId); //Seeing is believing
// }