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
      // eslint-disable-next-line
      console.log(chalk.bgRed('User disconnected', socket.id));
    });

    socket.on('createGame', (gameId, adminCode) => {
      Game.setAdmin(gameId, adminCode, socket);
      socket.join(gameId);
      // eslint-disable-next-line
      console.log(chalk.blue(Game.get(gameId).log()));
    });

    socket.on('join', (gameCode, userId) => {
      Game.addPlayer(gameCode, userId, socket);
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
        io.to(player.socket.id).emit('role', player.role);
      });
    });

  });

};