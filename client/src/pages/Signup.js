import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row, Container, Card, Form } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import './styles/signup.scss';
import { motion } from 'framer-motion';

const Signup = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [userFormData, setUserFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const [addUser] = useMutation(ADD_USER);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setUserFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const createUser = async (e) => {
        e.preventDefault();

        setErrorMessage('');

        try {
            console.log('Creating user...');

            const { data } = await addUser({
                variables: {
                    username: userFormData.username,
                    email: userFormData.email,
                    password: userFormData.password,
                },
            });

            console.log('GraphQL Response:', data);

            if (!data || !data.addUser || !data.addUser.token) {
                throw new Error('Signup failed: token missing');
            }

            // save optional data
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);

            // login after signup
            Auth.login(data.addUser.token);

            // clear fields
            setFirstName('');
            setLastName('');

            setUserFormData({
                username: '',
                email: '',
                password: '',
            });

            navigate('/welcome');

        } catch (err) {
            console.error('Signup Error:', err);

            let message = 'Signup failed';

            if (err.graphQLErrors?.length) {
                message = err.graphQLErrors[0].message;
            }

            else if (err.networkError) {
                message = 'Cannot connect to backend server';
            }

            else if (err.message) {
                message = err.message;
            }

            setErrorMessage(message);
        }
    };

    return (
        <div className='container-fluid sign-up-background'>
            <Container>
                <Row className='vh-100 d-flex justify-content-center align-items-center'>
                    <Col md={8} lg={6} xs={12}>
                        <Card className='shadow'>
                            <Card.Body>

                                <div className='mb-3 mt-md-4'>

                                    <h2 className='fw-bold mb-2 text-uppercase text-center'>
                                        Welcome Solo Travelers
                                    </h2>

                                    <p className='text-center mb-4'>
                                        Please enter your Sign Up information
                                    </p>

                                    {errorMessage && (
                                        <p
                                            style={{
                                                color: 'red',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {errorMessage}
                                        </p>
                                    )}

                                    <Form onSubmit={createUser}>

                                        <Form.Group className='mb-3'>
                                            <Form.Label>First Name</Form.Label>

                                            <Form.Control
                                                type='text'
                                                className='form-bubble'
                                                placeholder='First Name'
                                                value={firstName}
                                                onChange={(e) =>
                                                    setFirstName(e.target.value)
                                                }
                                            />
                                        </Form.Group>

                                        <Form.Group className='mb-3'>
                                            <Form.Label>Last Name</Form.Label>

                                            <Form.Control
                                                type='text'
                                                className='form-bubble'
                                                placeholder='Last Name'
                                                value={lastName}
                                                onChange={(e) =>
                                                    setLastName(e.target.value)
                                                }
                                            />
                                        </Form.Group>

                                        <Form.Group className='mb-3'>
                                            <Form.Label>Username</Form.Label>

                                            <Form.Control
                                                type='text'
                                                className='form-bubble'
                                                placeholder='Username'
                                                name='username'
                                                value={userFormData.username}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className='mb-3'>
                                            <Form.Label>Email</Form.Label>

                                            <Form.Control
                                                type='email'
                                                className='form-bubble'
                                                placeholder='Enter Email'
                                                name='email'
                                                value={userFormData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className='mb-3'>
                                            <Form.Label>Password</Form.Label>

                                            <Form.Control
                                                type='password'
                                                className='form-bubble'
                                                placeholder='Password'
                                                name='password'
                                                value={userFormData.password}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>

                                        <div className='d-flex justify-content-center'>

                                            <motion.button
                                                type='submit'
                                                className='sign-up-btn'
                                                whileHover={{
                                                    scale: 1.05
                                                }}
                                            >
                                                Signup
                                            </motion.button>

                                        </div>

                                    </Form>

                                    <div className='mt-3 text-center'>

                                        Already registered?

                                        <motion.button
                                            type='button'
                                            className='sign-in-btn'
                                            onClick={() =>
                                                navigate('/login')
                                            }
                                            whileHover={{
                                                scale: 1.05
                                            }}
                                        >
                                            Login
                                        </motion.button>

                                    </div>

                                </div>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Signup;