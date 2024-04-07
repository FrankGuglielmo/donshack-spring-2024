import { Formik } from 'formik';
import * as yup from 'yup';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import NavbarMain from '../components/Navbar';
import Footer from '../components/Footer';
import React, { useState, useEffect } from "react";

function CreateEventForm() {
    const schema = yup.object().shape({
        eventTitle: yup.string().required('Event title is required'),
        date: yup.date().required('Date is required'),
        time: yup.string().required('Time is required'),
        description: yup.string().required('Description is required'),
        file: yup.mixed().required('An image file is required'),
    });

    const [hover, setHover] = useState(false);
    const style = {
        backgroundColor: hover ? '#C75222' : '#EF8356',
        border: '1px solid #FF6B2D',
        cursor: 'pointer',
    };

    return (
        <main>
            <header>
                <NavbarMain />
            </header>
            <h2 id="form-header" > Create an Event:</h2>
            <Formik
                validationSchema={schema}
                onSubmit={console.log}
                initialValues={{
                    eventTitle: '',
                    date: '',
                    time: '',
                    description: '',
                    file: null,
                }}
            >
                {({ handleSubmit, handleChange, setFieldValue, values, touched, errors }) => (
                    <Form className="form" noValidate onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group as={Col} controlId="validationFormik01">
                                <Form.Label className="form-label" >Event Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="eventTitle"
                                    className="form-control"
                                    value={values.eventTitle}
                                    onChange={handleChange}
                                    isInvalid={!!errors.eventTitle}
                                />
                                <Form.Control.Feedback type="invalid">{errors.eventTitle}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} controlId="validationFormik02">
                                <Form.Label className="form-label">Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    className="form-control"
                                    value={values.date}
                                    onChange={handleChange}
                                    isInvalid={!!errors.date}
                                />
                                <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} controlId="validationFormik03">
                                <Form.Label className="form-label">Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="time"
                                    className="form-control"
                                    value={values.time}
                                    onChange={handleChange}
                                    isInvalid={!!errors.time}
                                />
                                <Form.Control.Feedback type="invalid">{errors.time}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3 pt-3" controlId="validationFormik06">
                            <Form.Label className="form-label">Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                className="form-control"
                                value={values.description}
                                onChange={handleChange}
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3 pt-3" controlId="validationFormik07">
                            <Form.Label className="form-label">Image File</Form.Label>
                            <Form.Control
                                type="file"
                                name="file"
                                className="form-control"
                                onChange={(event) => {
                                    setFieldValue("file", event.currentTarget.files[0]);
                                }}
                                isInvalid={!!errors.file}
                            />
                            <Form.Control.Feedback type="invalid">{errors.file}</Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" className="mt-3" style={style} onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}>Submit</Button>
                    </Form>
                )}
            </Formik>
            <footer>
                <Footer />
            </footer>
        </main>
    );
}

export default CreateEventForm;
