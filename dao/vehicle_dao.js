'use strict';

const Vehicle = require('../entity/vehicle');
const db = require('../db');


const createVehicle = function (row) {
    return new Vehicle(row.id, row.category, row.brand, row.model);
}


/**
 * Get tasks and optionally filter them
 */
exports.getVehicles = function (categories, brands) {
    if (categories && brands) {
        return getVehiclesByCategoryAndBrand(categories, brands);
    } else if (categories) {
        return getVehiclesByCategory(categories);
    } else if (brands) {
        return getVehiclesByBrand(brands);
    } else {
        return getAllVehicles();
    }
}

const getVehiclesByCategory = function (categories) {
    const categoryVal = categories.split("|");
    return new Promise((resolve, reject) => {
        const sql = "select id, category, brand, model \
                    from vehicles \
                    where category in (" + categoryVal.map(function(){ return '?' }).join(',') + ")" ;
        db.all(sql, categoryVal, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let vehicles = rows.map((row) => createVehicle(row));
                resolve(vehicles);
            }
        });
    });
}

const getVehiclesByBrand = function (brands) {
    const brandVal = brands.split("|");
    
    return new Promise((resolve, reject) => {
        const sql = "select id, category, brand, model \
                    from vehicles \
                    where brand in (" + brandVal.map(function(){ return '?' }).join(',') + ")";
        db.all(sql, brandVal, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let vehicles = rows.map((row) => createVehicle(row));
                resolve(vehicles);
            }
        });
    });
}

const getVehiclesByCategoryAndBrand = function (categories, brands) {
    const categoryVal = categories.split("|");
    const brandVal = brands.split("|");

    return new Promise((resolve, reject) => {
        const sql = "select id, category, brand, model \
                    from vehicles \
                    where category in (" + categoryVal.map(function(){ return '?' }).join(',') + ") \
                        and brand in (" + brandVal.map(function(){ return '?' }).join(',') + ")";
        db.all(sql, [...categoryVal, ...brandVal], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let vehicles = rows.map((row) => createVehicle(row));
                resolve(vehicles);
            }
        });
    });
}

const getAllVehicles = function () {
    return new Promise((resolve, reject) => {
        const sql = "select id, category, brand, model \
                    from vehicles";
        db.all(sql, [], (err, rows) => {
            
            if (err) {
                reject(err);
            } else {
                let vehicles = rows.map((row) => createVehicle(row));
                resolve(vehicles);
            }
        });
    });
}