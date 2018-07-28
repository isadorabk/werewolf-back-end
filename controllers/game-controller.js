const Game = require('../models/game');
const Player = require('../models/player');
const chalk = require('chalk');
let gameRunning = false;

exports.createGame = async (req, res) => {
  if (gameRunning) throw new Error('Game already running');
  const newGame = Game.create();
  gameRunning = true;
  res.status(201).send(newGame);
};

exports.createPlayer = async (req, res) => {
  const username = req.body.username;
  const newPlayer = Player.create(username);
  res.status(201).send(newPlayer);
};

exports.getPlayers = async (req, res) => {
  const gameId = req.params.id;
  const players = Game.getPlayers(gameId);
  res.status(200).send(players);
};

exports.onConnection = (socket) => {
  // eslint-disable-next-line
  console.log(chalk.bgBlue('User connected', socket.id));

  socket.on('createGame', (gameId, adminCode) => {
    Game.setAdmin(gameId, adminCode, socket);
    socket.join(gameId);
    // eslint-disable-next-line
    console.log(chalk.blue(Game.get(gameId).log()));
  });

  socket.on('join', (gameCode, userId) => {
    Game.addPlayer(gameCode, userId, socket);
    // game.players.forEach(socket => socket.emit('newPlayer', username))
  });

};
