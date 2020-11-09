const mongoose = require('mongoose');

const StationSchema = new mongoose.Schema({
  clientId: String,
  name: String,
  longitude: String,
  latitude: String,
  pm25: Number,
  pm10: Number,
  so2: Number,
  no2: Number,
  co: Number,
  o3: Number,
  smoke: Number,
});

module.exports = StationSchema;
