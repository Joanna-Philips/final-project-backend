import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as api from "../api";

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/', api.adventures);
app.use('/', api.equipments);

app.get('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

module.exports = app;
