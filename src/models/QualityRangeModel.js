const mongoose = require('mongoose');

const QualityRangeSchema = require('../schemas/qualityRangeSchema');

const QualityRangeModel = mongoose.model('QualityRangeModel', QualityRangeSchema);

module.exports = class QualityRange {
  constructor(quality) {
    this.qualityRange = new QualityRangeModel({
      class: 'qualityRange',
      quality,
      index: [],
      pts: [],
      pm10: [],
      so2: [],
      no2: [],
      co: [],
      o3: [],
      smoke: [],
    });
  }

  saveQualityRange() {
    return new Promise((resolve) => {
      this.qualityRange.save().then(() => {
        resolve();
      });
    });
  }

  findMe() {
    return new Promise((resolve) => {
      QualityRangeModel.findOne({ quality: this.qualityRange.name },
        (err) => { if (err) { resolve(false); } }).then((qualityRange) => {
        if (qualityRange) {
          this.qualityRange = qualityRange;
          resolve(true);
        }
        resolve(false);
      });
    });
  }
}
