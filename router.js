const router = require('express').Router();
const playersController = require('./controllers/players-controller');
const gameController = require('./controllers/game-controller');

router
  .post('/new-game', gameController.createGame);

module.exports = router;