const express = require('express');
const bodyParser = require('body-parser');
const mongooseConnection = require('./db/connection');
const Broker = require('./broker');

const app = express();

Broker.getInstance().init();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongooseConnection.connect();

require('./router')(app);

app.listen(3000);

module.exports = app;
