const Game = require('../models/game');
const Player = require('../models/player');

exports.createGame = async (req, res) => {
  try {
    const newGame = Game.createGame();
    res.status(201).send(newGame);
  } catch (e) {
    res.status(400).send({
      errors: e.errors
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
