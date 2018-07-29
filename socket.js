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
    console.log(chalk.bgBlue('User connected', socket.id));

    socket.on('disconnect', () => {
      //if admin disconnect --> game.resetgamerunning
      // eslint-disable-next-line
      console.log(chalk.bgRed('User disconnected', socket.id));
    });

    socket.on('createGame', (gameId, adminCode) => {
      Game.setAdmin(gameId, adminCode, socket);
      socket.join(gameId);
      // eslint-disable-next-line
      console.log(chalk.blue(Game.get(gameId).log()));
    });

    socket.on('joinGame', (gameCode, userId) => {
      Game.addPlayer(gameCode, userId, socket);
      socket.join(gameCode);
    });

    socket.on('startGame', (gameId) => {
      // eslint-disable-next-line
      console.log(chalk.bgGreen('Game started: ', gameId));
      const game = Game.get(gameId);
      let playersArr = [];
      for (let key in game.players) {
        if (game.players.hasOwnProperty(key)) {
          playersArr.push(game.players[key]);
        }
      }
      playersArr.forEach(player => {
        let { socket, ...playerInfo } = player;
        io.to(player.socket.id).emit('player', playerInfo);
      });
    });

  });

};

// //get allsockets in a room
// var clients_in_the_room = io.sockets.adapter.rooms[gameCode].sockets;
// for (var clientId in clients_in_the_room) { //the first is the admin
//   console.log('client: %s', clientId); //Seeing is believing 
// }