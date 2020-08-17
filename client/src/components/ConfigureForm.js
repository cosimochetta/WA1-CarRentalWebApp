import React, { useState, useContext, useEffect } from 'react';
import API from "../api/API"
import Rent from "../api/rent"
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert';
import { Redirect, withRouter } from 'react-router-dom';
import { AuthContext } from '../context/Context'
import * as c from '../const/const.js'
import moment from "moment"

function ConfigureForm(props) {
    const [starting_day, setStarting_day] = useState("");
    const [end_day, setEnd_day] = useState("");
    const [cost, setCost] = useState("");
    const [km, setKm] = useState("0");
    const [driver_age, setDriver_age] = useState("");
    const [extra_driver, setExtra_driver] = useState("");
    const [extra_insurance, setExtra_insurance] = useState(false);
    const [category, setCategory] = useState("A");
    const [isFrequent, setIsFrequent] = useState(null);
    const [available, setAvailable] = useState(null);
    const [loadingPrice, setLoadingPrice] = useState(true);
    const [submitErr, setSubmitErr] = useState("");
    const authContext = useContext(AuthContext);

    useEffect(() => {
        setLoadingPrice(true);
        API.getCountPastRents()
            .then((count) => { setIsFrequent(count >= 3); setLoadingPrice(false) });
    }, [])

    useEffect(() => {
        if (moment(end_day).isBefore(moment(starting_day)))
            setAvailable(null);
        else
            API.getAvailableVehiclesNumber(category, starting_day, end_day)
                .then((available) => setAvailable(available))
    }, [starting_day, end_day, category])

    useEffect(() => {
        let newCost = 0;
        if (!starting_day || !end_day || !driver_age
            || !c.categoriesPrice[category] || !extra_driver
            || moment(end_day).isBefore(moment(starting_day))
            || moment(starting_day).isBefore(moment().subtract(1, "d"))) {
            newCost = ""
        }
        else {
            newCost = c.evaluatePrice(category, starting_day, end_day, km, driver_age, extra_driver, extra_insurance, isFrequent, available / props.categoryCount[category])
        }
        setCost(newCost);
    }, [starting_day, end_day, driver_age, category, km, extra_driver, extra_insurance, isFrequent, available, props.categoryCount])



    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) {
            form.reportValidity();
        } else {
            let err = "";
            if (available <= 0)
                err += "No car available;\n"
            if (!c.categories.includes(category))
                err += "Invalid category;\n"
            if (moment(starting_day).isBefore(moment().subtract(1, 'd')))
                err += "Can't go back in the past;"
            if (moment(end_day).isBefore(moment(starting_day)))
                err += "End day is after starting day;\n";
            if (!Object.keys(c.kmPerDay).includes(km))
                err += "Invalid km/day option;\n"
            if (extra_insurance !== false && extra_insurance !== true)
                err += "Error extra insurance parameter;\n"
            if (driver_age < 18 || driver_age > 100)
                err += "Insert valid age;\n"
            if (extra_driver < 0 || extra_driver > 4)
                err += "Invalid extra driver number;\n"

            if (err) {
                setSubmitErr(err);
                return;
            }

            let rent = new Rent(null, authContext.authUser.id, null, starting_day, end_day, cost, km, driver_age, extra_driver, extra_insurance, category);

            props.history.push(
                '/payment',
                { rent: rent }
            )
        }
    }

    if (!authContext.authUser)
        return <Redirect to='/login' />;
    return (
        <>
            <Container fluid>
                <Row className="justify-content-center mb-3">
                    <h1 className="text-primary"><strong>Book a vehicles</strong></h1>

                </Row>
                {submitErr &&
                    <>
                        <Row className="justify-content-center">
                            <Alert variant="danger">
                                {submitErr}
                            </Alert>
                        </Row>
                    </>
                }
                <Row className="justify-content-center my-3">
                    {isFrequent &&
                        <Alert variant="success">
                            You're a frequent customer! A 10% discount will be applied! <br />
                        </Alert>
                    }
                </Row>
                <Row className="justify-content-center">
                    <Form method="POST" onSubmit={(event) => handleSubmit(event)}>
                        <Form.Group controlId="category">

                            <Form.Label>Select vehicle category</Form.Label>
                            <Form.Control as="select" custom size="sm" onChange={(ev) => setCategory(ev.target.value)} required>
                                {c.categories.map((category, index) =>
                                    <option key={index}>{category}</option>
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Row>
                            <Col>
                                <Form.Group controlId="starting_day">
                                    <Form.Label>Starting day</Form.Label>
                                    <Form.Control type="date" value={starting_day} min={moment(new Date()).format("YYYY-MM-DD")} onChange={(ev) => setStarting_day(ev.target.value)} required />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="end_day">
                                    <Form.Label>End day</Form.Label>
                                    {starting_day && <Form.Control type="date" value={end_day} min={moment(starting_day).format("YYYY-MM-DD")} onChange={(ev) => setEnd_day(ev.target.value)} required />}
                                    {!starting_day && <Form.Control type="date" disabled />}
                                </Form.Group>
                            </Col>
                        </Form.Row>

                        <Form.Row>
                            <Col>
                                <Form.Group controlId="km_day">

                                    <Form.Label>Km/day</Form.Label>
                                    <Form.Control as="select" custom size="sm" value={km} onChange={(ev) => setKm(ev.target.value)} required>
                                        <option value="0">Less than 50 km/day</option>
                                        <option value="1">Less than 150 km/day</option>
                                        <option value="2">Unlimited km/day</option>
                                    </Form.Control>
                                </Form.Group>

                            </Col>
                            <Col style={{
                                "display": "flex",
                                "justifyContent": "center",
                                "alignItems": "center"
                            }}>
                                <Form.Group controlId="extra_insurance" >
                                    <Form.Check custom label="extra insurance" checked={extra_insurance} onChange={(ev) => setExtra_insurance(ev.target.checked)} />
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Group controlId="extra_driver">
                                    <Form.Label>Extra driver</Form.Label>
                                    <Form.Control size="sm" type="number" min="0" max="4" placeholder="0-4" value={extra_driver} required onChange={(ev) => setExtra_driver(ev.target.value)}></Form.Control>
                                </Form.Group>

                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Driver age</Form.Label>
                                    <Form.Control size="sm" type="number" min="18" max="100" placeholder="18-100" value={driver_age} required onChange={(ev) => setDriver_age(ev.target.value)}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Button variant="primary" type="submit">Submit request</Button>
                            </Col>
                            <Col>
                                {loadingPrice && <Spinner animation="border" />}
                                {!loadingPrice && cost && <h6>Price for this solution: {cost.toFixed(2)}</h6>}
                                {(!cost || cost === 0) && !loadingPrice && <h6>Complete form to see price</h6>}
                            </Col>
                        </Form.Row>
                    </Form>
                </Row>
                <Row className="justify-content-center my-3">
                    {available === null && <h5>Insert category, starting day and end day to see available vehicles</h5>}
                    {available === 0 && <h5>There are no vehicles available</h5>}
                    {available === 1 && <h5>There is {available} vehicles availables</h5>}
                    {available > 1 && <h5>There are {available} vehicles availables</h5>}
                </Row>

                <Row className="justify-content-center my-3">
                    {available !== null && available !== 0 && (available / props.categoryCount[category] < 0.1) &&
                        <Alert variant="warning">
                            Number of vehicles available of same category is less than 10%. <br />
                            10% surcharge will be added.
                        </Alert>
                    }
                </Row>

            </Container>
        </>
    );
}
export default withRouter(ConfigureForm);