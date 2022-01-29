'use strict';

const User = require('../entity/user');
const db = require('../db');
const bcrypt = require('bcrypt');

/**
 * Function to create a User object from a row of the users table
 * @param {*} row a row of the users table
 */
const createUser = function (row) {
    const id = row.id;
    const username = row.username;
    const email = row.email;
    const hash = row.hash;
    return new User(id, username, email, hash);
}

/**
 * Get user given email
 */
exports.getUser = function (email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id, username, email, hash FROM users WHERE email = ?"
        db.all(sql, [email], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
  };

  /**
   * Get user given id
   */
exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id, username, email, hash FROM users WHERE id = ?"
        db.all(sql, [id], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
  };

/**
 * Check is user password match with given password
 */
exports.checkPassword = function(user, password){
    let hash = bcrypt.hashSync(password, 10);
    return bcrypt.compareSync(password, user.hash);
}