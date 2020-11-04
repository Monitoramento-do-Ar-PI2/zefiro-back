const schedule = require('node-schedule');
const mqtt = require('mqtt');
const StationModel = require('../models/StationModel');

const client = mqtt.connect('mqtt://localhost:1883');

const ZefiroScheduler = {
  setSchedulerTo00() {
    schedule.scheduleJob('*/2 * * * *', () => {
      const date = new Date();
      const minutes = date.getMinutes();

      if ((minutes % 10 !== 0)
       && (minutes !== 6 || minutes !== 16 || minutes !== 26
       || minutes !== 36 || minutes !== 46 || minutes !== 56)) {
        StationModel.findAll().then((stations) => {
          stations.forEach((station) => {
            client.publish(`Zefiro/${station.name}`, '00');
          });
        });
      }
    });
  },
  setSchedulerTo01() {
    schedule.scheduleJob('10,20,30,40,50 * * * *', () => {
      StationModel.findAll().then((stations) => {
        stations.forEach((station) => {
          client.publish(`Zefiro/${station.name}`, '01');
        });
      });
    });
  },
  setSchedulerTo10() {
    schedule.scheduleJob('0 6-18 * * *', () => {
      StationModel.findAll().then((stations) => {
        stations.forEach((station) => {
          client.publish(`Zefiro/${station.name}`, '10');
        });
      });
    });
  },
  setSchedulerTo11() {
    schedule.scheduleJob('0 19-23,0-5 * * *', () => {
      StationModel.findAll().then((stations) => {
        stations.forEach((station) => {
          client.publish(`Zefiro/${station.name}`, '11');
        });
      });
    });
  },
};

module.exports = ZefiroScheduler;
