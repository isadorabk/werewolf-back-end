const Game = require('../models/game');
const Player = require('../models/player');
let gameRunning = false;
// const io = require('../socket').io;

exports.createGame = async (req, res) => {
  if (gameRunning) throw new Error('Game already running');
  const newGame = Game.createGame();
  gameRunning = true;
  res.status(201).send(newGame);
};

exports.createPlayer = async (req, res) => {
  const username = req.body.username;
  const newPlayer = Player.create(username);
  res.status(201).send(newPlayer);
};
