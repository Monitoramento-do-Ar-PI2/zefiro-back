const qualityRangeTable = require('./qualityRangeTableUtil');

const IQAUtil = {
  calculateAllIQA(pollutants) {
    let iqaMax = {
      index: 0,
      quality: 'Boa',
    };

    pollutants.forEach((pollutant) => {
      const iqaPollutant = this.calculateIQAR(pollutant.concentration, pollutant.pollutant);

      if (iqaPollutant.index > iqaMax.index) {
        iqaMax = iqaPollutant;
      }
    });

    return iqaMax;
  },
  calculateIQAR(concentration, pollutant) {
    const iqar = {
      index: 0,
      quality: 'Boa',
    };

    qualityRangeTable.forEach((qualityRange) => {
      if (qualityRange[pollutant][0] <= concentration
        && qualityRange[pollutant][1] >= concentration) {
        const index = qualityRange.index[1] - qualityRange.index[0];
        const con = qualityRange[pollutant][1] - qualityRange[pollutant][0];
        const ale = concentration - qualityRange[pollutant][0];
        iqar.index = ((index / con) * ale) + qualityRange.index[0];
        iqar.quality = qualityRange.quality;
      } else if (qualityRange.quality === 'Crítica' && qualityRange[pollutant][0] <= concentration) {
        const index = qualityRange.index[0];
        const con = qualityRange[pollutant][0];
        const ale = concentration - qualityRange[pollutant][0];
        iqar.index = ((index / con) * ale) + qualityRange.index[0];
        iqar.quality = qualityRange.quality;
      }
    });

    return iqar;
  },
};

module.exports = IQAUtil;
