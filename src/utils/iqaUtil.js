const qualityRangeTable = require('./qualityRangeTableUtil');

const IQAUtil = {
  calculateBadsIQA(pollutants) {
    let iqaMax = {
      index: 0,
      quality: 'Boa',
      pollutantInitial: '',
      pollutant: '',
    };
    const iqas = [];
    const badIQAS = [];

    pollutants.forEach((pollutant) => {
      const iqaPollutant = this.calculateIQAR(pollutant.concentration,
        pollutant.pollutantInitial, pollutant.pollutant);

      iqas.push(iqaPollutant);
      if (iqaPollutant.index > iqaMax.index) {
        iqaMax = iqaPollutant;
      }
    });

    iqas.forEach((iqa) => {
      if (iqa.quality !== 'Boa' && iqa.quality !== 'Regular') {
        badIQAS.push(iqa);
      }
    });

    return badIQAS;
  },
  calculateAllIQA(pollutants) {
    let iqaMax = {
      index: 0,
      quality: 'Boa',
      pollutantInitial: '',
      pollutant: '',
    };

    pollutants.forEach((pollutant) => {
      const iqaPollutant = this.calculateIQAR(pollutant.concentration,
        pollutant.pollutantInitial, pollutant.pollutant);

      if (iqaPollutant.index > iqaMax.index) {
        iqaMax = iqaPollutant;
      }
    });

    return iqaMax;
  },
  calculateIQAR(concentration, pollutantInitial, pollutant) {
    const iqar = {
      index: 0,
      quality: 'Boa',
      pollutantInitial,
      pollutant,
    };

    qualityRangeTable.forEach((qualityRange) => {
      if (qualityRange[pollutantInitial][0] <= concentration
        && qualityRange[pollutantInitial][1] >= concentration) {
        const index = qualityRange.index[1] - qualityRange.index[0];
        const con = qualityRange[pollutantInitial][1] - qualityRange[pollutantInitial][0];
        const ale = concentration - qualityRange[pollutantInitial][0];
        iqar.index = ((index / con) * ale) + qualityRange.index[0];
        iqar.quality = qualityRange.quality;
      } else if (qualityRange.quality === 'Crítica' && qualityRange[pollutantInitial][0] <= concentration) {
        const index = qualityRange.index[0];
        const con = qualityRange[pollutantInitial][0];
        const ale = concentration - qualityRange[pollutantInitial][0];
        iqar.index = ((index / con) * ale) + qualityRange.index[0];
        iqar.quality = qualityRange.quality;
      }
    });

    return iqar;
  },
};

module.exports = IQAUtil;
