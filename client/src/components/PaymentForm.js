import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import API from '../api/API'
import Spinner from 'react-bootstrap/Spinner'
import { Redirect, withRouter, Link } from 'react-router-dom';


const PaymentForm = (props) => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [card, setCard] = useState("");
    const [cvv, setCvv] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentErr, setPaymentErr] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [addRentErr, setAddRentErr] = useState(false);
    const [addRentSuccess, setAddRentSuccess] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (addRentSuccess)
            return;

        setLoading(true);
        setPaymentErr(false);
        setPaymentSuccess(false);
        setAddRentErr(false);
        setAddRentSuccess(false);

        const form = event.currentTarget;
        if (!form.checkValidity()) {
            form.reportValidity();
        } else {
            const cardRegex = /^([0-9]{4}-){3}[0-9]{4}$/;
            const cvvRegex = /^[0-9]{3}$/;
            let err = "";
            if (name == null)
                err += "Insert name; "
            if (surname == null)
                err += "Insert surname; "
            if (!cardRegex.test(card))
                err += "Insert valid card; "
            if (!cvvRegex.test(cvv))
                err += "Insert valid cvv; "
            if (err) {
                setPaymentErr(err);
                return;
            }

            API.submitPayment(name, surname, card, cvv, 30)
                .then((result) => {
                    setPaymentSuccess(true);

                    API.addRent({ ...props.location.state.rent })
                        .then(() => {
                            setAddRentSuccess(true)
                        })
                        .catch((err) => {
                            console.log(err);
                            setAddRentErr(err.param + "error: " + err.msg)
                        })
                }).catch((err) => {
                    console.log("PAY ERR")
                    setPaymentErr(true);
                }).finally(() => {
                    setLoading(false);
                })
        }
    }

    if (!props.location || !props.location.state || !props.location.state.rent)
        return <Redirect to='/config' />;


    return (
        <>
            <Container fluid>
                <Row className="justify-content-center mb-3">
                    <h1 className="text-primary text-center">Payment</h1>
                </Row>
                <Row className="justify-content-sm-center">
                    <Col md={4} className="bg-primary py-3 rounded">
                        <Form method="POST" onSubmit={(event) => handleSubmit(event)}>
                            <Form.Group controlId="name">
                                <Form.Label><h4 className="text-light">Name</h4></Form.Label>
                                <Form.Control type="text" name="name" placeholder="Ajeje" value={name} onChange={(ev) => setName(ev.target.value)} required autoFocus />
                            </Form.Group>

                            <Form.Group controlId="surname">
                                <Form.Label><h4 className="text-light">Surname</h4></Form.Label>
                                <Form.Control type="text" name="surname" placeholder="Brazorf" value={surname} onChange={(ev) => setSurname(ev.target.value)} required />
                            </Form.Group>

                            <Form.Group controlId="card">
                                <Form.Label><h4 className="text-light">Credit card number</h4></Form.Label>
                                <Form.Control type="text" name="card" pattern="([0-9]{4}-){3}[0-9]{4}" placeholder="xxxx-xxxx-xxxx-xxxx" value={card} onChange={(ev) => setCard(ev.target.value)} required />
                            </Form.Group>
                            <Form.Group controlId="cvv">
                                <Form.Label><h4 className="text-light">CVV</h4></Form.Label>
                                <Form.Control type="text" pattern="[0-9]{3}" name="cvv" placeholder="123" value={cvv} onChange={(ev) => setCvv(ev.target.value)} required autoFocus />
                            </Form.Group>

                            {!addRentSuccess && <Button variant="success" type="submit" block>Reserve now for {props.location.state.rent.cost.toFixed(2)}$</Button>}
                            {addRentSuccess && <Button variant="success" disabled block>Reserve now for {props.location.state.rent.cost.toFixed(2)}$</Button>}
                        </Form>
                    </Col>
                    <Col md={4}>
                        {loading && <Spinner animation="border" />}
                        {paymentSuccess &&
                            <Alert variant="success">
                                Payment successfull
                            </Alert>
                        }
                        {paymentErr &&
                            <Alert variant="danger">
                                Server error during payment, try again
                            </Alert>
                        }
                        {addRentErr &&
                            <Alert variant="danger">
                                {addRentErr}
                            </Alert>
                        }
                        {addRentSuccess &&
                            <>
                                <Alert variant="success">
                                    Rent successfull!
                                </Alert>
                                <Link to="/config" ><Button variant="secondary">Click here to go back to the configurator!</Button></Link>
                            </>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default withRouter(PaymentForm);