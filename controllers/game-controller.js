const Game = require('../models/game');
const chalk = require('chalk');

exports.createGame = async (req, res) => {
  const newGame = Game.create();
  res.status(201).send(newGame);
};

exports.onAdminConnection = (socket) => {
  // eslint-disable-next-line
  console.log(chalk.bgBlue('Admin connected'));

  socket.on('join', (gameId, adminCode) => {
    Game.setAdmin(gameId, adminCode, socket);
    // eslint-disable-next-line
    console.log(chalk.blue(Game.get(gameId).log()));
  });
};