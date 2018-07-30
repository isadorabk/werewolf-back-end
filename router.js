const router = require('express').Router();
const gameController = require('./controllers/game-controller');

router
  .post('/new-game', gameController.createGame)
  .post('/new-player', gameController.createPlayer);

module.exports = router;