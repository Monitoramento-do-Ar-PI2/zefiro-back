const mongoose = require('mongoose');

const saveQualityRanges = require('./saveQualityRangeDB.js');

const qualityRangeDB = require('../utils/qualityRangeTableUtil.js');

module.exports = {
  connect: () => new Promise((resolve) => {
    mongoose.Promise = global.Promise;
    const options = {
      useUnifiedTopology: true,
      keepAlive: true,
      socketTimeoutMS: 540000,
      autoIndex: false,
      poolSize: 10,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
    };

    mongoose.connect('mongodb://mongo:27017/zefiro-back', options).then(async () => {
      await saveQualityRanges.deleteAllQualityRanges();
      await saveQualityRanges.saveQualityRange(qualityRangeDB);
      resolve();
    }).catch();
  }),
};
