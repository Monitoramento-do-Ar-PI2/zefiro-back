const express = require('express');
const mqtt = require('mqtt');
const StationModel = require('./models/StationModel');
const IQAUtil = require('./utils/iqaUtil');

const client = mqtt.connect('mqtt://localhost:1883');

const router = express.Router();

router.get('/', (_, res) => {
  res.json('WELCOME!!');
});

router.get('/getStation', (_, res) => {
  client.publish('Zefiro/FGA1', '1');
  res.json('DONE');
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
  StationModel.findNearbyStation(req.query.longitude, req.query.latitude).then((station) => {
    const iqa = IQAUtil.calculateAllIQA([
      { pollutant: 'P T S', pollutantInitial: 'pts', concentration: station.pts },
      { pollutant: 'P M 10', pollutantInitial: 'pm10', concentration: station.pm10 },
      { pollutant: 'Dióxido de enxofre', pollutantInitial: 'so2', concentration: station.so2 },
      { pollutant: 'Dióxido de nitrogénio', pollutantInitial: 'no2', concentration: station.no2 },
      { pollutant: 'Monóxido de carbono', pollutantInitial: 'co', concentration: station.co },
      { pollutant: 'Ozônio', pollutantInitial: 'o3', concentration: station.o3 },
      { pollutant: 'Fumaça', pollutantInitial: 'smoke', concentration: station.smoke },

    ]);
    res.json({ station, iqa });
  });
});

router.get('/station/pollutants', (req, res) => {
  StationModel.findNearbyStation(req.query.longitude, req.query.latitude).then((station) => {
    const iqas = IQAUtil.calculateBadsIQA([
      { pollutant: 'P T S', pollutantInitial: 'pts', concentration: station.pts },
      { pollutant: 'P M 10', pollutantInitial: 'pm10', concentration: station.pm10 },
      { pollutant: 'Dióxido de enxofre', pollutantInitial: 'so2', concentration: station.so2 },
      { pollutant: 'Dióxido de nitrogénio', pollutantInitial: 'no2', concentration: station.no2 },
      { pollutant: 'Monóxido de carbono', pollutantInitial: 'co', concentration: station.co },
      { pollutant: 'Ozônio', pollutantInitial: 'o3', concentration: station.o3 },
      { pollutant: 'Fumaça', pollutantInitial: 'smoke', concentration: station.smoke },
    ]);
    res.json({ station, iqas });
  });
});

module.exports = (app) => app.use('/', router);
