import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as api from "../api";

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/users', api.users);
app.use('/equipments', api.equipments);
app.use('/adventures', api.adventures);
app.use('/purchases', api.purchases);
app.use('/avatars', api.avatars);

app.get('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

// module.exports = app;
export default app;
