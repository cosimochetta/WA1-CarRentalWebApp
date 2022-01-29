//import express
const express = require("express");
const vehicleDao = require("./dao/vehicle_dao");
const userDao = require("./dao/user_dao");
const rentDao = require("./dao/rent_dao");
const morgan = require("morgan"); // logging middleware
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const payment = require("./payment");
const path = require("path");
const jwtSecret =
  "6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX";
const expireTime = 30000; //seconds
// Authorization error
const authErrorObj = {
  errors: [{ param: "Server", msg: "Authorization error" }],
};

//create application
const app = express();
const PORT = process.env.PORT || 3001;

// Set-up logging
app.use(morgan("tiny"));

// Process body content
app.use(express.json());
app.use(express.static("./client/build"));

app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  userDao
    .getUser(email)
    .then((user) => {
      if (user === undefined) {
        res.status(404).send({
          errors: [{ param: "Server", msg: "Invalid e-mail" }],
        });
      } else {
        if (!userDao.checkPassword(user, password)) {
          res.status(401).send({
            errors: [{ param: "Server", msg: "Wrong password" }],
          });
        } else {
          //AUTHENTICATION SUCCESS
          const token = jsonwebtoken.sign({ user: user.id }, jwtSecret, {
            expiresIn: expireTime,
          });
          res.cookie("token", token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 1000 * expireTime,
          });
          res.json({ id: user.id, username: user.username });
        }
      }
    })
    .catch(
      // Delay response when wrong user/pass is sent to avoid fast guessing attempts
      (err) => {
        new Promise((resolve) => {
          setTimeout(resolve, 1000);
        }).then(() => res.status(401).json(authErrorObj));
      }
    );
});

app.use(cookieParser());

app.post("/api/logout", (req, res) => {
  res.clearCookie("token").end();
});

//GET /vehicles
app.get("/api/vehicles", (req, res) => {
  vehicleDao
    .getVehicles(req.query.category, req.query.brand)
    .then((vehicles) => {
      res.json(vehicles);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: err }],
      });
    });
});

// For the rest of the code, all APIs require authentication
app.use(
  jwt({
    secret: jwtSecret,
    getToken: (req) => req.cookies.token,
  })
);

// To return a better object in case of errors
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json(authErrorObj);
  }
});

// AUTHENTICATED REST API endpoints

//GET /user
app.get("/api/user", (req, res) => {
  const user = req.user && req.user.user;
  userDao
    .getUserById(user)
    .then((user) => {
      res.json({ id: user.id, username: user.username });
    })
    .catch((err) => {
      res.status(401).json(authErrorObj);
    });
});

//GET /past
app.get("/api/past", (req, res) => {
  const user = req.user && req.user.user;

  rentDao
    .getPastRents(user)
    .then((rents) => {
      res.json(rents);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: err }],
      });
    });
});

//GET /future
app.get("/api/future", (req, res) => {
  const user = req.user && req.user.user;

  rentDao
    .getFutureRents(user)
    .then((rents) => {
      res.json(rents);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: err }],
      });
    });
});

//GET /isfrequent
app.get("/api/isfrequent", (req, res) => {
  const user = req.user && req.user.user;

  rentDao
    .countPastRents(user)
    .then((count) => {
      res.json(count);
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: err }],
      });
    });
});

//Get /available
app.get("/api/available", (req, res) => {
  const category = req.query.category;
  const startDate = req.query.start;
  const endDate = req.query.end;

  rentDao
    .getAvailableVehicles(category, startDate, endDate)
    .then((vehicles) => {
      res.json({ count: vehicles.length });
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ msg: err }],
      });
    });
});

//POST /payment
app.post("/api/payment", (req, res) => {
  payment
    .validatePayment(req.body)
    .then(() => {
      res.status(201).json(true);
    })
    .catch(() => {
      res.status(400).end();
    });
});

//POST /rent
app.post("/api/rent", (req, res) => {
  const rent = req.body;
  if (
    !rent ||
    !rent.user ||
    !rent.starting_day ||
    !rent.end_day ||
    !rent.cost ||
    !rent.km ||
    !rent.driver_age ||
    !rent.extra_driver ||
    rent.extra_insurance === null ||
    !rent.category
  ) {
    res.status(400).end();
  } else {
    const user = req.user && req.user.user;
    if (rent.user != user) res.status(406).end();

    Promise.all([
      rentDao.countPastRents(user),
      rentDao.getAvailableVehicles(
        rent.category,
        rent.starting_day,
        rent.end_day
      ),
      vehicleDao.getVehicles(rent.category, null),
    ])
      .then((values) => {
        let [userRentCount, availableVehicles, vehicles] = values;
        rentDao
          .createRent(
            rent,
            userRentCount.count,
            availableVehicles,
            vehicles.length
          )
          .then((id) => {
            res.status(201).json({ id: id });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ param: "Server", msg: err });
          });
      })
      .catch((err) => {
        res.status(500).json({ param: "Server", msg: err });
      });
  }
});

//DELETE /reservation/:rentId
app.delete("/api/rent/:rentId", (req, res) => {
  const user = req.user && req.user.user;
  rentDao
    .deleteRent(req.params.rentId, user)
    .then((result) => res.status(204).end())
    .catch((err) =>
      res.status(500).json({
        errors: [{ param: "Server", msg: err }],
      })
    );
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);
