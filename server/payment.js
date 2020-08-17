'use strict'

exports.validatePayment = function(payment){
    return new Promise((resolve, reject) => {
        if (!payment || !payment.name || !payment.surname || !payment.card || !payment.cvv || !payment.amount) {
            reject();
        } else {
            resolve(true);
        }
    })
}