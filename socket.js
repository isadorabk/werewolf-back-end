const IO = require('socket.io');
const gameController = require('./controllers/game-controller');

module.exports = (server) => {
  const io = IO(server);

  io.of('/admin')
    .on('connection', gameController.onAdminConnection);

};
