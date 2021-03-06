const express = require('express');
const StationModel = require('./models/StationModel');
const IQAUtil = require('./utils/iqaUtil');
const RecommendationUtil = require('./utils/recommendationUtil');

const router = express.Router();

router.get('/', (_, res) => {
  res.json('WELCOME!!');
});

router.post('/saveStation', (req, res) => {
  const stationModel = new StationModel(req.body);
  stationModel.save().then((station) => {
    res.json(station);
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
      { pollutant: 'P M 2.5', pollutantInitial: 'pm2_5', concentration: station.pm2_5 },
      { pollutant: 'P M 10', pollutantInitial: 'pm10', concentration: station.pm10 },
      { pollutant: 'Dióxido de enxofre', pollutantInitial: 'so2', concentration: station.so2 },
      { pollutant: 'Dióxido de nitrogénio', pollutantInitial: 'no2', concentration: station.no2 },
      { pollutant: 'Monóxido de carbono', pollutantInitial: 'co', concentration: station.co },
      { pollutant: 'Ozônio', pollutantInitial: 'o3', concentration: station.o3 },
    ]);
    res.json({ station, iqa });
  });
});

router.get('/station/pollutants', (req, res) => {
  StationModel.findNearbyStation(req.query.longitude, req.query.latitude).then((station) => {
    const iqas = IQAUtil.calculateBadsIQA([
      { pollutant: 'P M 2.5', pollutantInitial: 'pm2_5', concentration: station.pm2_5 },
      { pollutant: 'P M 10', pollutantInitial: 'pm10', concentration: station.pm10 },
      { pollutant: 'Dióxido de enxofre', pollutantInitial: 'so2', concentration: station.so2 },
      { pollutant: 'Dióxido de nitrogénio', pollutantInitial: 'no2', concentration: station.no2 },
      { pollutant: 'Monóxido de carbono', pollutantInitial: 'co', concentration: station.co },
      { pollutant: 'Ozônio', pollutantInitial: 'o3', concentration: station.o3 },
    ]);
    res.json({ station, iqas });
  });
});

router.get('/recommendation', (_, res) => {
  const advice = RecommendationUtil[Math.floor(Math.random() * RecommendationUtil.length)];
  res.json({ advice });
});

module.exports = (app) => app.use('/', router);
