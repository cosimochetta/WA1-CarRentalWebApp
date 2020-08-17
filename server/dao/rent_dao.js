'use strict';

const Rent = require('../entity/rent');
const Vehicle = require('../entity/vehicle')
const db = require('../db');
const moment = require('moment');
const c = require("../const/const")

const createVehicle = function (row) {
    return new Vehicle(row.id, row.category, row.brand, row.model);
}

const createRentInfo = function (row) {
    const vehicle_info = {
        id: row.id,
        category: row.category,
        brand: row.brand,
        model: row.model
    }

    const extra_insurance = (row.extra_insurance === 1) ? true : false;

    return new Rent(row.id, row.user, vehicle_info, row.starting_day, row.end_day, row.cost,
        row.km, row.driver_age, row.extra_driver, extra_insurance, row.category);
}

/**
 * Get past or current rents given user id 
 */
exports.getPastRents = function (user) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT r.id, r.user, r.vehicle, r.starting_day, r.end_day, r.cost, r.km, r.driver_age, \
                    r.extra_driver, r.extra_insurance, v.category, v.brand, v.model \
                    FROM rents as r, vehicles as v \
                    WHERE r.vehicle = v.id AND r.user = ? \
                        AND date(r.end_day) < date()";
        db.all(sql, [user], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let rents = rows.map((row) => createRentInfo(row));
                resolve(rents);
            }
        });
    });
}

/**
 * Get future rents given user id
 */
exports.getFutureRents = function (user) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT r.id, r.user, r.vehicle, r.starting_day, r.end_day, r.cost, r.km, r.driver_age, \
                    r.extra_driver, r.extra_insurance, v.category, v.brand, v.model \
                    FROM rents as r, vehicles as v \
                    WHERE r.vehicle = v.id AND r.user = ? \
                        AND date(r.end_day) >= date()";
        db.all(sql, [user], (err, rows) => {

            if (err) {
                reject(err);
            } else {
                let rents = rows.map((row) => createRentInfo(row));
                resolve(rents);
            }
        });
    });
}

/**
 * Insert a rent in the database and returns the id of the inserted rent. 
 * To get the id, this.lastID is used. To use the "this", db.run uses "function (err)" instead of an arrow function.
 */
exports.createRent = function (rent, userRentCount, availableVehicles, totVehicles) {
    return new Promise((resolve, reject) => {
        let err = "";
        if (!c.categories.includes(rent.category))
            err += "Invalid category";
        if (moment(rent.end_day).isBefore(moment(rent.starting_day)))
            err += "End day is after starting day; ";
        if (moment(rent.starting_day).isBefore(moment().subtract(1, 'd')))
            err += "Can't go back in the past;"
        if (!Object.keys(c.kmPerDay).includes(rent.km))
            err += "Invalid km/day option; "
        if (rent.extra_insurance !== false && rent.extra_insurance !== true)
            err += "Error extra insurance parameter; "
        if (rent.driver_age < 18 || rent.driver_age > 100)
            err += "Insert valid age; "
        if (rent.extra_driver < 0 || rent.extra_driver > 4)
            err += "Invalid extra driver number; "

        if (err)
            reject(err);

        if (availableVehicles.length <= 0)
            reject("No vehicle available;");
        let percAvailable = availableVehicles.length / totVehicles
        let cost = c.evaluatePrice(rent.category, rent.starting_day, rent.end_day, rent.km, rent.driver_age, rent.extra_driver, rent.extra_insurance, userRentCount >= 3, percAvailable)

        if (cost != rent.cost)
            reject("Price is not coherent with data");

        const addRentSQL = 'INSERT INTO rents(user, vehicle, starting_day, end_day, cost, km, driver_age, extra_driver, extra_insurance, category)\
            VALUES(?,?,?,?,?,?,?,?,?,?)';
        db.run(addRentSQL, [rent.user, availableVehicles[0].id, rent.starting_day, rent.end_day, rent.cost,
        rent.km, rent.driver_age, rent.extra_driver, rent.extra_insurance, rent.category], function (err) {
            if (err) {
                reject(err);
            }
            else {
                console.log(this.lastID);
                resolve(this.lastID);
            }
        });
    });
}

/**
 * Delete a rend with a given id
 */
exports.deleteRent = function (id, user) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM rents WHERE id = ? AND user = ? AND date(starting_day) >= date() ';
        db.run(sql, [id, user], (err) => {
            if (err)
                reject(err);
            else
                resolve(null);
        })
    });
}


/**
 * Return number of available vehicles for category in the days of the rental
 */
exports.getAvailableVehicles = function (category, startDate, endDate) {
    return new Promise((resolve, reject) => {
        const vehiclesNotAvailable = "SELECT vehicle \
                                        FROM rents \
                                        WHERE Date($start) <= Date(end_day) \
                                        AND Date($end) >= Date(starting_day) "
        const sql = "SELECT id, category, brand, model \
                    FROM vehicles \
                    WHERE category = $cat \
                        AND id NOT IN(" + vehiclesNotAvailable + ")";
        db.all(sql, { $cat: category, $start: startDate, $end: endDate }, (err, rows) => {

            if (err) {
                reject(err);
            } else {
                let vehicles = rows.map((row) => createVehicle(row));
                resolve(vehicles);
            }
        });
    });
}

exports.countPastRents = function (user) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT COUNT(*) as count \
                    FROM rents \
                    WHERE user = ? \
                    AND Date(end_day) < Date()";
        db.all(sql, [user], (err, rows) => {

            if (err) {
                reject(err);
            } else {
                resolve(rows[0]);
            }
        });
    });
}