import React, { useState, useEffect, useContext } from 'react';
import Table from "react-bootstrap/Table"
import { Redirect } from "react-router-dom"
import API from "../api/API"
import Spinner from "react-bootstrap/Spinner"
import Alert from "react-bootstrap/Alert"
import RentItem from './RentItem';
import { AuthContext } from '../context/Context'
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

export default function Bookings(props) {
    const [pastLoading, setPastLoading] = useState(true);
    const [futureLoading, setFutureLoading] = useState(true);
    const [pastRents, setPastRents] = useState([]);
    const [futureRents, setFutureRents] = useState([]);
    const [pastLoadingErr, setPastLoadingErr] = useState(null);
    const [futureLoadingErr, setFutureLoadingErr] = useState(null);
    const [deleteRentErr, setDeleteRentErr] = useState(false);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        API.getPastRents().then(
            (rents) => {
                setPastRents(rents);
            }
        ).catch((err) => {
            setPastLoadingErr(true);
        }).finally(() => {
            setPastLoading(false);
        });

        API.getFutureRents().then(
            (rents) => {
                setFutureRents(rents);
            }
        ).catch((err) => {
            setFutureLoadingErr(true);
        }).finally(() => {
            setFutureLoading(false);
        });

    }, []);

    const deleteRent = (id) => {
        setDeleteRentErr(false);
        API.deleteRent(id).then(
            () => {
                setFutureLoading(true);
                API.getFutureRents().then(
                    (rents) => {
                        setFutureRents(rents);
                    }
                ).catch((err) => {
                    setFutureLoadingErr(err.status);
                }).finally(() => {
                    setFutureLoading(false);
                });
            }
        ).catch(
            (errorObj) => {
                setDeleteRentErr("Deleting rent " + errorObj.param + "error: " + errorObj.msg);
            }
        );
    }

    if (!authContext.authUser)
        return <Redirect to='/login' />;
    return (
        <Row className="justify-content-center">
            <Col sm={10}>
                <h4 className="text-primary my-2"><strong >Bookings</strong></h4>
                {futureLoadingErr &&
                    <Alert variant="danger">
                        {"Error retrieving bookings"}
                    </Alert>
                }
                {deleteRentErr &&
                    <Alert variant="danger">
                        {"Error deleting rent"}
                    </Alert>
                }
                {!futureLoading && !futureLoadingErr && futureRents.length === 0 &&
                    <Alert variant="secondary">
                        There aren't bookings
                    </Alert>
                }

                {futureLoading && <Spinner animation="border" />}
                <Table>
                    <thead>
                        <tr>
                            <th>Model</th>
                            <th>Brand</th>
                            <th>Category</th>
                            <th>Start date</th>
                            <th>End date</th>
                            <th>Cost</th>
                            <th>km/day</th>
                            <th>Driver age</th>
                            <th>Extra driver</th>
                            <th>Extra insurance</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {futureRents.map((rent) => (<RentItem deleteRent={deleteRent} key={rent.id} rent={rent} isFuture={true} />))}
                    </tbody>
                </Table>

                <h4 className="text-primary my-2"><strong>Past rents</strong></h4>

                {pastLoadingErr &&
                    <Alert variant="danger">
                        {"Error retrieving past rents"}
                    </Alert>}
                {pastLoading && <Spinner animation="border" />}
                {!pastLoading && !pastLoadingErr && pastRents.length === 0 &&
                    <Alert variant="secondary">
                        There aren't past rents
                    </Alert>
                }
                <Table>
                    <thead>
                        <tr>
                            <th>Model</th>
                            <th>Brand</th>
                            <th>Category</th>
                            <th>Start date</th>
                            <th>End date</th>
                            <th>Cost</th>
                            <th>km/day</th>
                            <th>Driver age</th>
                            <th>Extra driver</th>
                            <th>Extra insurance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pastRents.map((rent) => (<RentItem key={rent.id} rent={rent} isFuture={false} />))}
                    </tbody>
                </Table>
            </Col>
        </Row>
    )
}