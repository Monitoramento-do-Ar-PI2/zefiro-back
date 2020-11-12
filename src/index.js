const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const mongooseConnection = require('./db/connection');
const Broker = require('./broker');
const ZefiroScheduler = require('./utils/scheduler');

const FIREBASE_DATABASE_URL = 'https://zefiro-app.firebaseio.com';

const app = express();

Broker.getInstance().init();

admin.initializeApp({
  databaseURL: FIREBASE_DATABASE_URL,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongooseConnection.connect();

ZefiroScheduler.setSchedulerTo00();
ZefiroScheduler.setSchedulerTo01();
ZefiroScheduler.setSchedulerTo10();
ZefiroScheduler.setSchedulerTo11();

require('./router')(app);

app.listen(3000);

module.exports = app;
