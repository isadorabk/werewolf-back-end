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
      const player = Game.addPlayer(gameCode, userId, socket);
      socket.join(gameCode);
      const { socket: _, ...playerData } = player;
      socket.to(gameCode).emit('gameCommand', 'playerCreated', playerData);
    });

    socket.on('startGame', (gameId) => {
      Game.assignRoles(gameId);
      const game = Game.get(gameId);
      const players = game.players;
      const playersArr = [];
      for (let key in players) {
        if (players.hasOwnProperty(key)) {
          let { socket: _, ...playerInfo } = players[key];
          io.to(players[key].socket.id).emit('gameCommand', 'playerInfo', playerInfo);
          playersArr.push(playerInfo);
        }
      }
      io.to(game.admin.id).emit('gameCommand', 'playersList', playersArr);
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
      io.to(playerKilled.socketId).emit('gameCommand', 'updateLifeStatus', playerKilled.lifeStatus);
      io.to(game.admin.id).emit('gameCommand', 'updateLifeStatus', {playerId, lifeStatus: playerKilled.lifeStatus});
      // eslint-disable-next-line
      console.log(chalk.bgMagenta('Kill player: ', playerId));
    });





  });

};

// //get allsockets in a room
// var clients_in_the_room = io.sockets.adapter.rooms[gameCode].sockets;
// for (var clientId in clients_in_the_room) { //the first is the admin
//   console.log('client: %s', clientId); //Seeing is believing 
// }