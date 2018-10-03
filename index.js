const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router.js');

require('./socket')(server);
const port = process.env.PORT || 3000;

app
  .use(cors())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(router);
  
server.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server listening on port ${port}`);
});
