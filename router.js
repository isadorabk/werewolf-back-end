const router = require('express').Router();
const gameController = require('./controllers/game-controller');

router
  .post('/new-game', gameController.createGame)
  .post('/new-player', gameController.createPlayer)
  .get('/game/:id', gameController.getPlayers);

module.exports = router;