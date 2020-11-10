const recommendationTable = require('./recommendationTableUtil');

const RecommendationUtil = {
  giveAdvice(iqa) {
    let advice = '';
    if (iqa.quality === recommendationTable.quality) {
      advice = recommendationTable.advices[
        Math.floor(
          Math.random() * recommendationTable.advices.length,
        )
      ];
    }
    return advice;
  },
};

module.exports = RecommendationUtil;
