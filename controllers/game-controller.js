const Game = require('../models/game');
const Player = require('../models/player');
let gameRunning = false;
// const io = require('../socket').io;

exports.createGame = async (req, res) => {
  try {
    const newGame = Game.createGame();
    gameRunning = true;
    res.status(201).send(newGame);
  } catch (e) {
    res.status(400).send({
      errors: e.errors
      // if (gameRunning) throw new Error('Game already running');
    });
  }
};

exports.createPlayer = async (req, res) => {
  try {
    const username = req.body.username;
    const newPlayer = Player.create(username);
    res.status(201).send(newPlayer);
  } catch (e) {
    res.status(400).send({
      errors: e.errors
    });
  }
};
