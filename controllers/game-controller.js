const Game = require('../models/game');
const Player = require('../models/player');
const chalk = require('chalk');

exports.createGame = async (req, res) => {
  const newGame = Game.create();
  res.status(201).send(newGame);
};

exports.createPlayer = async (req, res) => {
  const username = req.body.username;
  const newPlayer = Player.create(username);
  res.status(201).send(newPlayer);
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