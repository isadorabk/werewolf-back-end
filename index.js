const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const cors = require('cors');

const router = require('./router.js');
require('./db');
const port = process.env.PORT || 3000;

app
  .use(cors())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(router);

io.on('connection', (socket) => {
  // eslint-disable-next-line
  console.log(`user ${socket.id} connected`);
  socket.on('disconnect', () => {
    // eslint-disable-next-line
    console.log(`user ${socket.id} disconnected`);
  });
});

server.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server listening on port ${port}`);
});