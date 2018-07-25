const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router.js');
require('./db');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// routes
app.use(router);

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server listening on port ${port}`);
});