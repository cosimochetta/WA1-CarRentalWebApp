import React, { useState, useContext } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../context/Context'
//import carImage from '../images/rent-car-login-image.jpg';


const LoginForm = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const authContext = useContext(AuthContext);

    const handleSubmit = (event, onLogin) => {
        event.preventDefault();
        onLogin(email, password);
    }

    if (authContext.authUser)
        return <Redirect to='/' />;
    return (
        <>
            <Container fluid className="login-content-position">
                <Row className="justify-content-md-center mb-3">
                    <Col sm={10}>
                        <h1 className="text-primary">Login to your account</h1>
                    </Col>
                </Row>
                <Row className="justify-content-sm-center login-bg">
                    <Col lg={7} sm={6} className="px-0 d-sm-block d-none ">
                    </Col>
                    <Col lg={5} sm={6} className="bg-primary py-3 rounded">
                        <Form method="POST" onSubmit={(event) => handleSubmit(event, authContext.login)}>
                            <Form.Group controlId="username" >
                                <Form.Label><h3 className="text-light">E-mail</h3></Form.Label>
                                <Form.Control type="email" name="email" placeholder="E-mail" value={email} onChange={(ev) => setEmail(ev.target.value)} required autoFocus />
                            </Form.Group>

                            <Form.Group controlId="password">
                                <Form.Label><h3 className="text-light">Password</h3></Form.Label>
                                <Form.Control type="password" name="password" placeholder="Password" value={password} onChange={(ev) => setPassword(ev.target.value)} required />
                            </Form.Group>
                            <Button variant="success" type="submit" className="px-4">Login</Button>
                        </Form>
                        {authContext.authErr &&
                            <Alert variant="danger">
                                {authContext.authErr.msg}
                            </Alert>
                        }
                    </Col>
                </Row>
            </Container>
        </>

    );
}

export default LoginForm;