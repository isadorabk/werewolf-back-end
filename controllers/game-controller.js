const Game = require('../models/game');
const Player = require('../models/player');
const chalk = require('chalk');
let gameRunning = false;
// const io = require('../socket').io;

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
