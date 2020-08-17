const moment = require('moment');

exports.categories = ['A', 'B', 'C', 'D', 'E'];
exports.categoriesPrice = {
    'A': 80,
    'B': 70,
    'C': 60,
    'D': 50,
    'E': 40
}

exports.kmPerDay = {
    "0": "less than 50",
    "1": "less than 150",
    "2": "unlimited"
}

exports.kmPricePercent = {
    "0": -5,
    "1": 0,
    "2": 5
}

exports.ageUnder25PricePercent = 5;
exports.ageOver65PricePercent = 10;
exports.extraDriverPricePercent = 15;
exports.extraInsurancePricePercent = 20;
exports.lessThan10PercCategoryPricePercent = 10;
exports.frequentPricePercent = -10;

exports.evaluatePrice = function(category, starting_day, end_day, km, driver_age, extra_driver, extra_insurance, isFrequent, percAvailable){
    let newCost = this.categoriesPrice[category];
    newCost *= (moment(end_day).diff(moment(starting_day), "days") + 1)
    newCost *= (1 + this.kmPricePercent[km] / 100);
    if (driver_age >= 65) newCost *= (1 + this.ageOver65PricePercent / 100);
    if (driver_age <= 25) newCost *= (1 + this.ageUnder25PricePercent / 100);
    if (parseInt(extra_driver) > 0) newCost *= (1 + this.extraDriverPricePercent / 100);
    if (extra_insurance) newCost *= (1 + this.extraInsurancePricePercent / 100);
    if (isFrequent) newCost *= (1 + this.frequentPricePercent / 100);
    if (percAvailable < 0.1) newCost *= (1 + this.lessThan10PercCategoryPricePercent / 100);
    return newCost
}