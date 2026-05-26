import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import { motion } from "framer-motion";
import "./styles/login.scss";

const Login = () => {
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        email: "",
        password: "",
    });

    const [login] = useMutation(LOGIN_USER);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await login({
                variables: {
                    email: formState.email,
                    password: formState.password,
                },
            });

            console.log("Login successful:", data);

            Auth.login(data.login.token);

            navigate("/welcome");

        } catch (err) {
            console.error("Login error:", err);
            alert("Invalid email or password");
        }
    };

    return (
        <div className="container-fluid login-background">
            <Container>
                <Row className="vh-100 d-flex justify-content-center align-items-center">
                    <Col md={8} lg={6} xs={12}>
                        <Card className="shadow">
                            <Card.Body>

                                <h2 className="fw-bold text-center mb-4">
                                    Login
                                </h2>

                                <Form onSubmit={handleFormSubmit}>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>

                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="Enter Email"
                                            value={formState.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>

                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Enter Password"
                                            value={formState.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <div className="d-flex justify-content-center">

                                        <motion.button
                                            className="sign-up-btn"
                                            type="submit"
                                            whileHover={{
                                                scale:1.05
                                            }}
                                        >
                                            Login
                                        </motion.button>

                                    </div>

                                </Form>

                                <div className="mt-3 text-center">
                                    Don't have an account?

                                    <motion.button
                                        className="sign-in-btn"
                                        type="button"
                                        onClick={() =>
                                            navigate("/signup")
                                        }
                                        whileHover={{
                                            scale:1.05
                                        }}
                                    >
                                        Signup
                                    </motion.button>

                                </div>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;