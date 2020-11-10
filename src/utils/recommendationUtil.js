const recommendationTable = require('./recommendationTableUtil');

const RecommendationUtil = {
    giveAdvice(iqa) {
        const advice = '';
        if(iqa.quality == recommendationTable.quality) {
           advice = recommendationTable.advices[Math.floor(Math.random()*recommendationTable.advices.length)];
        };
        return advice;
    }
};

module.exports = RecommendationUtil;