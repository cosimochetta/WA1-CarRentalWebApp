import React, { useState, useEffect } from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner'
import LoginForm from './components/LoginForm';
import PaymentForm from './components/PaymentForm';
import ConfigureForm from './components/ConfigureForm';
import API from './api/API';
import { Redirect, Route } from 'react-router-dom';
import { Switch, withRouter } from 'react-router';
import { AuthContext } from './context/Context';
import Browse from './components/Browse';
import Header from './components/Header';
import Bookings from './components/Bookings';
import { categories } from './const/const'
import Alert from "react-bootstrap/Alert"

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [authErr, setAuthErr] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [vehicleErr, setVehiclesErr] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  useEffect(() => {
    setUserLoading(true);
    setVehiclesLoading(true);
    // Check is user is already logged
    API.isAuthenticated().then(
      (user) => {
        setAuthUser(user);
        setAuthErr(null);
      }
    ).catch((err) => {
      setAuthUser(null);
    }).finally(() => {
      setUserLoading(false)
    }
    );

    // Retrieve vehicles List
    API.getAllVehicles().then(
      (vehicles) => {
        setVehicles(vehicles);
      }
    ).catch((err) => {
      setVehiclesErr(true);
    }).finally(() => {
      setVehiclesLoading(false);
    })

  }, []);



  const logout = () => {
    API.userLogout().then(() => {
      setAuthUser(null);
      setAuthErr(null);
    });
  }

  const login = (email, password) => {
    API.userLogin(email, password).then(
      (user) => {
        setAuthUser(user);
        setAuthErr(null);
      }
    ).catch(
      (errorObj) => {
        const err0 = errorObj.errors[0];
        setAuthErr(err0);
      }
    );
  }



  const getCategoryCount = (vehicles) => {
    var counts = {};
    for (let c of categories) {
      counts[c] = 0;
    }
    vehicles.map((vehicle) => vehicle.category).forEach((x) => { counts[x] += 1; });
    return counts;
  }

  const value = {
    authUser: authUser,
    authErr: authErr,
    login: login,
    logout: logout
  }

  return (
    <AuthContext.Provider value={value}>
      <Container fluid>
        <Header></Header>
        <Row className="below-nav"></Row>
        {userLoading && vehiclesLoading && <Spinner animation="border" />}
        {vehicleErr &&
          <Alert variant="danger">
            Error! Failed to load vehicle list
          </Alert>
        }
        {!userLoading && !vehiclesLoading && !vehicleErr &&
          <>
            <Switch>
              <Route path="/login">
                <LoginForm />
              </Route>

              <Route path="/browse">
                <Browse vehicles={[...vehicles]} />
              </Route>

              <Route path="/config">
                <ConfigureForm categoryCount={getCategoryCount(vehicles)}></ConfigureForm>
              </Route>

              <Route path="/bookings">
                  <Bookings></Bookings>
              </Route>
              <Route path="/payment">
                <PaymentForm />
              </Route>

              <Route>
                <Redirect to='/browse' />
              </Route>
            </Switch>
          </>
        }
      </Container>
    </AuthContext.Provider>
  )

}

export default withRouter(App);