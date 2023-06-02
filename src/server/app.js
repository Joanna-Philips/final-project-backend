const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api_endpoints = require('../api');
const userDatabase = require ("../database/users");
const equipmentDatabase = require ("../database/equipments");
const adventureDatabase = require ("../database/adventures");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/', does_method_exist, api_endpoints);

app.get('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

function does_method_exist(req, res, next) {
  next();
}


module.exports = app;
