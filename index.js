const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router.js');
const fs = require('fs');
require('./db');
require('./socket')(server);
const port = process.env.PORT || 3000;

app
  .use(cors())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  // .use((req,res)=>{
  //   if (req.method === 'GET') {
  //     fs.readFile(__dirname + '/dist/werewolf-frontend/index.html', function (err, data) {
  //       if (err) {
  //         res.statusCode = 500;
  //         res.end(`Error getting the file: ${err}.`);
  //       } else {
  //         // based on the URL path, extract the file extention. e.g. .js, .doc, ...
  //         res.statusCode = 200;
  //         // if the file is found, set Content-type and send data
  //         res.setHeader('Content-type', 'text/html' );
  //         res.end(data);
  //       }
  //     });
  //   }
  // })
  // .use(express.static(__dirname + '/dist/werewolf-frontend'))
  .use(router);
  
server.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server listening on port ${port}`);
});
