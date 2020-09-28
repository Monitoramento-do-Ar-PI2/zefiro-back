const mongoose = require('mongoose');

const QualityRangeSchema = new mongoose.Schema({
  quality: String,
  index: Array,
  pts: Array,
  pm10: Array,
  so2: Array,
  no2: Array,
  co: Array,
  o3: Array,
  smoke: Array,
});

module.exports = QualityRangeSchema;
