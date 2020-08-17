import Vehicles from "./vehicles"
import Rent from "./rent"
const baseURL = "/api";


async function isAuthenticated() {
    let url = "/user";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if (response.ok) {
        return userJson;
    } else {
        let err = { status: response.status, errObj: userJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getAllVehicles() {
    let url = "/vehicles";

    const response = await fetch(baseURL + url);
    const vehiclesJson = await response.json();
    if (response.ok) {
        return vehiclesJson.map((t) => Vehicles.from(t));
    } else {
        let err = { status: response.status, errObj: vehiclesJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getFutureRents() {
    let url = "/future";

    const response = await fetch(baseURL + url);
    const rentJson = await response.json();
    if (response.ok) {
        return rentJson.map((t) => Rent.from(t));
    } else {
        let err = { status: response.status, err: rentJson.msg };
        throw err;  // An object with the error coming from the server
    }
}

async function getPastRents() {
    let url = "/past";

    const response = await fetch(baseURL + url);
    const rentJson = await response.json();
    if (response.ok) {
        return rentJson.map((t) => Rent.from(t));
    } else {
        let err = { status: response.status, err: rentJson.msg };
        throw err;  // An object with the error coming from the server
    }
}

async function userLogin(email, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password })
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(user);
                });
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function userLogout() {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}

async function getAvailableVehiclesNumber(category, startDate, endDate) {
    if (!category || !startDate || !endDate)
        return null;
    let url = "/available";
    url += "?category=" + category;
    url += "&start=" + startDate;
    url += "&end=" + endDate;

    const response = await fetch(baseURL + url);
    const availableJson = await response.json();
    if (response.ok) {
        return availableJson.count;
    } else {
        let err = { status: response.status, errObj: availableJson };
        throw err;  // An object with the error coming from the server
    }
}

async function getCountPastRents() {
    let url = "/isfrequent";

    const response = await fetch(baseURL + url);
    const pastRentsCountJson = await response.json();
    if (response.ok) {
        return pastRentsCountJson.count;
    } else {
        let err = { status: response.status, errObj: pastRentsCountJson };
        throw err;  // An object with the error coming from the server
    }
}

async function submitPayment(name, surname, card, cvv, amount) {
    return new Promise((resolve, reject) => {
        let url = "/payment";
        fetch(baseURL + url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, surname: surname, card: card, cvv: cvv, amount: amount })
        }).then((response) => {
            if (response.ok) {
                resolve(true);
            } else {
                let err = { status: response.status, errObj: "payment error" };
                reject(err);  // An object with the error coming from the server
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}

async function addRent(rent) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/rent", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rent),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ param: "Application", msg: "Cannot parse server response" })}); // something else
            }
        }).catch( (err) => {reject({ param: "Server", msg: "Cannot communicate" })}); // connection errors
    });
}

async function deleteRent(rentId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/rent/" + rentId, {
            method: 'DELETE'
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ param: "Application", msg: "Cannot parse server response" })}); // something else
            }
        }).catch( (err) => {reject({ param: "Server", msg: "Cannot communicate" })}); // connection errors
    });
}

const API = {
    isAuthenticated, getAllVehicles, userLogin, userLogout, getFutureRents, getPastRents,
     getAvailableVehiclesNumber, getCountPastRents, submitPayment, addRent, deleteRent
};
export default API;