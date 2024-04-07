import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import NavbarMain from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
// import AWS from "aws-sdk"; // Import AWS SDK

function FormExample() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading,
    getIdTokenClaims,
  } = useAuth0();
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [curUserID, setCurUserID] = useState(null);

  const navigate = useNavigate();
  const routeChange = () => {
    navigate(`/profile`);
  };
  const schema = yup.object().shape({
    eventTitle: yup.string().required("Event title is required"),
    date: yup.date().required("Date is required"),
    time: yup.string().required("Time is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    description: yup.string().required("Description is required"),
    file: yup.mixed().required("An image file is required"),
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isLoading) {
        try {
          const idTokenClaims = await getIdTokenClaims();
          const email = idTokenClaims?.email || "";
          setUserName(email);
          const sub = idTokenClaims?.sub || "";

          // Make a GET request to fetch all users
          axios
            .get("https://contract-manager.aquaflare.io/users/", {
              withCredentials: true,
            })
            .then((response) => {
              const allUsers = response.data;
              setUsers(allUsers);

              // Filter the users to find the user with the desired username
              const userWithUsername = allUsers.find(
                (user) => user.name === email
              );

              setCurUserID(userWithUsername.id);
            })
            .catch((error) => {
              console.error("Error fetching users:", error);
            });
        } catch (error) {
          console.error("Error retrieving ID token claims:", error);
        }
      }
    };
    fetchUserProfile();
  }, [getIdTokenClaims, isLoading]);

  const saveEvent = async (values) => {
    try {
      // Upload file to S3
      //   const s3 = new AWS.S3({
      //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      //   });

      //   const params = {
      //     Bucket: "your-bucket-name",
      //     Key: values.file.name, // Use file name as key
      //     Body: values.file,
      //   };

      //   const uploadResponse = await s3.upload(params).promise();
      //   const s3Url = uploadResponse.Location;

      const newEvent = {
        title: values.eventTitle,
        description: values.description,
        date: values.date,
        cover_photo: values.file,
        hosted_by: curUserID,
        saved_by: [],
      };

      console.log(newEvent);
      //Update DB
      //1. Send file to S3? Get URL from S3? Then, build event object with cover_photo: s3.url

      axios
        .post("https://contract-manager.aquaflare.io/events/", {
          title: values.eventTitle,
          description: values.description,
          date: values.date,
          cover_photo: values.file,
          hosted_by: curUserID,
          saved_by: [],
        })
        .then(() => {
          console.log("Saved successfully!");
        })
        .catch((error) => {
          console.error("Error saving event info:", error);
          console.log("Server Response:", error.response.data);
        });
      //2. Post event object
      //3. Editing events?
      //4. Deleting events?

      //Reroute to profile page
      routeChange();
    } catch (error) {
      console.error("Error uploading file or saving event:", error);
    }
  };

  return (
    <main>
      <header>
        <NavbarMain />
      </header>
      <h2 id="form-header"> Create an Event:</h2>
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
          <Form className="form" noValidate onSubmit={handleSubmit}>
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
      <footer>
        <Footer />
      </footer>
    </main>
  );
}

export default FormExample;
