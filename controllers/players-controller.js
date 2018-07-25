const Player = require('../models/player-model');

exports.addPlayer = async (req, res) => {
  try {
    const player = await Player.create({
      username: req.body.username,
      role: req.body.role,
      lifeStatus: req.body.lifeStatus
    });
    res.status(201).send(player);
  } catch (e) {
    res.status(400).send({
      errors: e.errors
    });
  }
};