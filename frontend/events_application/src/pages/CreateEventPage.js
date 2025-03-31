import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import NavbarMain from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import DOMPurify from "dompurify";

// Component for unauthorized access modal
const UnauthorizedModal = ({ show, onHide }) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Unauthorized</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      We've disabled creating new events at this time, please contact admins to have an event be created
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>Close</Button>
    </Modal.Footer>
  </Modal>
);

// function to display create event form
function CreateEventForm() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading,
    getIdTokenClaims,
  } = useAuth0();
  // initialized state for users
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [curUserID, setCurUserID] = useState(null);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // navigating to home page after event creation
  const navigate = useNavigate();
  const routeChange = () => {
    navigate(`/`);
  };

  const schema = yup.object().shape({
        eventTitle: yup.string().required('Event title is required'),
        date: yup.date().required('Date is required'),
        time: yup.string().required('Time is required'),
        description: yup.string().required('Description is required'),
        file: yup.mixed().required('An image file is required').test("fileType", "Unsupported File Format", value => {
            if (!value) return true; // bypassing validation if no file selected
            const supportedFormats = ['image/jpg', 'image/jpeg', 'image/png'];
            return supportedFormats.includes(value.type);
        }),
    });

  // Check if user is authorized to create events
  const checkAuthorization = (email) => {
    import("../config").then((configModule) => {
      const config = configModule.default;
      setIsAuthorized(config.allowedEventCreators.includes(email));
      
      // Show unauthorized modal if user is not authorized
      if (!config.allowedEventCreators.includes(email)) {
        setShowUnauthorizedModal(true);
      }
    });
  };

  // fetching user profile 
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isLoading) {
        try {
          const idTokenClaims = await getIdTokenClaims();
          const email = idTokenClaims?.email || "";
          setUserName(email);
          const sub = idTokenClaims?.sub || "";
          
          // Check if user is authorized to create events
          checkAuthorization(email);

          // Import config for API URL
          import("../config").then((configModule) => {
            const config = configModule.default;
            
            // Make a GET request to fetch all users
            axios
              .get(`${config.apiUrl}/users/`, {
                withCredentials: true,
              })
              .then((response) => {
                const allUsers = response.data;
                setUsers(allUsers);

                // Filter the users to find the user with the desired username
                const userWithUsername = allUsers.find(
                  (user) => user.name === email
                );

                if (userWithUsername) {
                  setCurUserID(userWithUsername.id);
                }
              })
              .catch((error) => {
                console.error("Error fetching users:", error);
              });
          });
        } catch (error) {
          console.error("Error retrieving ID token claims:", error);
        }
      }
    };
    fetchUserProfile();
  }, [getIdTokenClaims, isLoading]);

  // functionality that saves users created events
  const saveEvent = async (values) => {
    if (!isAuthorized) {
      setShowUnauthorizedModal(true);
      return;
    }
    
    try {
      //Update DB
      const newEvent = new FormData();
      newEvent.append("title", DOMPurify.sanitize(values.eventTitle)); //Sanitize user input
      newEvent.append("description", DOMPurify.sanitize(values.description)); //Sanitize user input
      newEvent.append("date", values.date);
      newEvent.append("cover_photo", values.file);
      newEvent.append("hosted_by", curUserID);

      // Send POST request with FormData
      // Import config for API URL
      const config = (await import("../config")).default;
      
      await axios
        .post(`${config.apiUrl}/events/`, newEvent, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          console.log("Saved successfully!");
          // Redirect to home page after successful event creation
          routeChange();
        })
        .catch((error) => {
          console.error("Error saving event info:", error);
          console.log("Server Response:", error.response.data);
        });

      //TODO: Editing events?
      //TODO: Deleting events?
      
    } catch (error) {
      console.error("Error uploading file or saving event:", error);
    }
  };

  return (
    <main>
      <header>
        <NavbarMain />
      </header>
      
      {/* Unauthorized Modal */}
      <UnauthorizedModal 
        show={showUnauthorizedModal} 
        onHide={() => {
          setShowUnauthorizedModal(false);
          // Redirect to home page if user is not authorized
          if (!isAuthorized) {
            routeChange();
          }
        }} 
      />
      
      <h2 id="form-header"> Create an Event:</h2>
      {isAuthorized ? (
        <Formik
        validationSchema={schema}
        onSubmit={console.log}
        initialValues={{
          eventTitle: "",
          date: "",
          time: "",
          city: "",
          state: "",
          description: "",
          file: null,
        }}
      >
        {({
          handleSubmit,
          handleChange,
          setFieldValue,
          values,
          touched,
          errors,
        }) => (
          <Form
            className="form"
            noValidate
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <Row>
              <Form.Group as={Col} controlId="validationFormik01">
                <Form.Label className="form-label">Event Title</Form.Label>
                <Form.Control
                  type="text"
                  name="eventTitle"
                  className="form-control"
                  value={values.eventTitle}
                  onChange={handleChange}
                  isInvalid={!!errors.eventTitle}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.eventTitle}
                </Form.Control.Feedback>
              </Form.Group>

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
                <Form.Control.Feedback type="invalid">
                  {errors.date}
                </Form.Control.Feedback>
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
                <Form.Control.Feedback type="invalid">
                  {errors.time}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group
                as={Col}
                controlId="validationFormik04"
                className="pt-3"
              >
                <Form.Label className="form-label">City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  className="form-control"
                  value={values.city}
                  onChange={handleChange}
                  isInvalid={!!errors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.city}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                as={Col}
                controlId="validationFormik05"
                className="pt-3"
              >
                <Form.Label className="form-label">State</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  className="form-control"
                  value={values.state}
                  onChange={handleChange}
                  isInvalid={!!errors.state}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.state}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group controlId="validationFormik06" className="pt-3">
              <Form.Label className="form-label">Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                className="form-control"
                value={values.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="validationFormik07" className="pt-3">
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
              <Form.Control.Feedback type="invalid">
                {errors.file}
              </Form.Control.Feedback>
            </Form.Group>
            <Button
              type="submit"
              className="mt-3"
              onClick={() => saveEvent(values)}
            >
              Submit form
            </Button>
          </Form>
        )}
      </Formik>
      ) : (
        <div className="unauthorized-message p-4 text-center">
          <p>Loading authorization status or checking if you can create events...</p>
        </div>
      )}
      <footer>
        <Footer />
      </footer>
    </main>
  );
}

export default CreateEventForm;
