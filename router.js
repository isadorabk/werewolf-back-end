const router = require('express').Router();
const gameController = require('./controllers/game-controller');

router
  .post('/new-game', gameController.createGame);

module.exports = router;