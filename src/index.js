const express = require('express');
const bodyParser = require('body-parser');
const mongooseConnection = require('./db/connection');
const Broker = require('./broker');
const ZefiroScheduler = require('./utils/scheduler');

const app = express();

Broker.getInstance().init();

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
