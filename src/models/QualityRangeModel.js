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

  appendIndex(value) {
    this.qualityRange.index.push(value);
  }

  appendPTS(value) {
    this.qualityRange.pts.push(value);
  }

  appendPM10(value) {
    this.qualityRange.pm10.push(value);
  }

  appendSO2(value) {
    this.qualityRange.so2.push(value);
  }

  appendNO2(value) {
    this.qualityRange.no2.push(value);
  }

  appendCO(value) {
    this.qualityRange.co.push(value);
  }

  appendO3(value) {
    this.qualityRange.o3.push(value);
  }

  appendSmoke(value) {
    this.qualityRange.smoke.push(value);
  }

  getQualityRange() {
    return this.qualityRange;
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

  deleteMe() {
    return new Promise((resolve, reject) => {
      QualityRangeModel.deleteOne({ quality: this.qualityRange.quality }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};
