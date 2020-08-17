import moment from 'moment'

export const categories = ['A', 'B', 'C', 'D', 'E'];
export const categoriesPrice = {
    'A': 80,
    'B': 70,
    'C': 60,
    'D': 50,
    'E': 40
}

export const kmPerDay = {
    "0": "less than 50",
    "1": "less than 150",
    "2": "unlimited"
}

export const kmPricePercent = {
    "0": -5,
    "1": 0,
    "2": 5
}

export const ageUnder25PricePercent = 5;
export const ageOver65PricePercent = 10;
export const extraDriverPricePercent = 15;
export const extraInsurancePricePercent = 20;
export const lessThan10PercCategoryPricePercent = 10;
export const frequentPricePercent = -10;

export const evaluatePrice = function(category, starting_day, end_day, km, driver_age, extra_driver, extra_insurance, isFrequent, percAvailable){
    let newCost = categoriesPrice[category];
    newCost *= (moment(end_day).diff(moment(starting_day), "days") + 1)
    newCost *= (1 + kmPricePercent[km] / 100);
    if (driver_age >= 65) newCost *= (1 + ageOver65PricePercent / 100);
    if (driver_age <= 25) newCost *= (1 + ageUnder25PricePercent / 100);
    if (parseInt(extra_driver) > 0) newCost *= (1 + extraDriverPricePercent / 100);
    if (extra_insurance) newCost *= (1 + extraInsurancePricePercent / 100);
    if (isFrequent) newCost *= (1 + frequentPricePercent / 100);
    if (percAvailable < 0.1) newCost *= (1 + lessThan10PercCategoryPricePercent / 100);
    return newCost
}