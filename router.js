const router = require('express').Router();
const playersController = require('./controllers/players-controller');

router
  .post('/join', playersController.addPlayer);

module.exports = router;