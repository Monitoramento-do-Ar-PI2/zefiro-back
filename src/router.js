const express = require('express');
const StationModel = require('./models/StationModel');
const IQAUtil = require('./utils/iqaUtil');

const router = express.Router();

router.get('/', (_, res) => {
  res.json('WELCOME!!');
});

router.post('/saveStation', (req, res) => {
  const stationModel = new StationModel(req.body);
  stationModel.deleteMe().finally(() => {
    stationModel.save().then((station) => {
      res.json(station);
    });
  });
});

router.get('/stations', (_, res) => {
  StationModel.findAll().then((station) => {
    res.json(station);
  });
});

router.get('/station', (req, res) => {
  StationModel.findNearbyStation(req.body.longitude, req.body.latitude).then((station) => {
    const iqa = IQAUtil.calculateAllIQA([
      { pollutant: 'pts', concentration: station.pts },
      { pollutant: 'pm10', concentration: station.pm10 },
      { pollutant: 'so2', concentration: station.so2 },
      { pollutant: 'no2', concentration: station.no2 },
      { pollutant: 'co', concentration: station.co },
      { pollutant: 'o3', concentration: station.o3 },
      { pollutant: 'smoke', concentration: station.smoke },

    ]);
    res.json({ station, iqa });
  });
});

module.exports = (app) => app.use('/', router);
