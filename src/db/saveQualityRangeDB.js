const mongoose = require('mongoose');

const QualityRange = require('../models/QualityRangeModel');

const QualityRangeSchema = require('../schemas/qualityRangeSchema');

const QualityRangeModel = mongoose.model('QualityRangeModel', QualityRangeSchema);

module.exports = {
  saveQualityRange(qualityRanges) {
    qualityRanges.forEach((element) => {
      const qualityRange = new QualityRange(element.quality);
      element.index.forEach((value) => {
        qualityRange.appendIndex(value);
      });
      element.pts.forEach((value) => {
        qualityRange.appendPTS(value);
      });
      element.pm10.forEach((value) => {
        qualityRange.appendPM10(value);
      });
      element.so2.forEach((value) => {
        qualityRange.appendSO2(value);
      });
      element.no2.forEach((value) => {
        qualityRange.appendNO2(value);
      });
      element.co.forEach((value) => {
        qualityRange.appendCO(value);
      });
      element.o3.forEach((value) => {
        qualityRange.appendO3(value);
      });
      element.smoke.forEach((value) => {
        qualityRange.appendSmoke(value);
      });
      qualityRange.findMe().then((isFound) => {
        if (!isFound) {
          qualityRange.saveQualityRange();
        }
      }).catch();
    });
  },

  deleteAllQualityRanges() {
    return new Promise((resolve) => {
      QualityRangeModel.deleteMany({ class: 'qualityRange' }).then(() => {
        resolve();
      });
    });
  },

};
