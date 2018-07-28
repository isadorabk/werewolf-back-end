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
  const game = Game.get(gameId);
  const players = game.players;
  let playersArr = [];
  for (let key in players) {
    if (players.hasOwnProperty(key)) {
      let { socket, ...player } = players[key];
      player.socketId = players[key].socket.id;
      playersArr.push(player);
    }
  }
  res.status(200).send(playersArr);
};

exports.onAdminConnection = (socket) => {
  // eslint-disable-next-line
  console.log(chalk.bgBlue('Admin connected', socket.id));

  socket.on('join', (gameId, adminCode) => {
    Game.setAdmin(gameId, adminCode, socket);
    // eslint-disable-next-line
    console.log(chalk.blue(Game.get(gameId).log()));
  });
};

exports.onPlayerConnection = (socket) => {
  // eslint-disable-next-line
  console.log(chalk.bgBlue('Player connected', socket.id));

  socket.on('join', (gameCode, userId) => {
    Game.addPlayer(gameCode, userId, socket);
  });
};
