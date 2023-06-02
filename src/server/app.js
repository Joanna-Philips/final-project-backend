const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('../api'); // Loads index.js automatically

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/', does_method_exist, api.default);

app.get('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

function does_method_exist(req, res, next) {
  next();
}


module.exports = app;
