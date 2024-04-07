import NavbarMain from "../components/Navbar";
import Footer from "../components/Footer";
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import EventCard from "../components/EventCard";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  // this is a place holder for what would be the HostedEvents associated with the logged in user
  const colors = ["#194b21", "#da4485", "#f0bbf7"];

  const { getIdTokenClaims, isLoading, logout } = useAuth0();
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Function to fetch events
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://contract-manager.aquaflare.io/events/"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Fetching events failed: ", error);
      }
    };

    fetchEvents();
  }, []);

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

              if (!userWithUsername) {
                // User doesn't exist, proceed to create a new user with a POST request
                console.log("User not found, creating a new user.");

                const newUser = {
                  name: email,
                  password: sub,
                };

                axios
                  .post(
                    "https://contract-manager.aquaflare.io/users/",
                    newUser,
                    {
                      withCredentials: true,
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  )
                  .then((postResponse) => {
                    console.log(
                      "User created successfully:",
                      postResponse.data
                    );
                  })
                  .catch((postError) => {
                    console.error("Error creating user:", postError);
                  });
              }
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

  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/create-event`;
    navigate(path);
  };

  return (
    <div>
      <header>
        <NavbarMain />
      </header>
      <div className="container">
        <main>
          <header>
            <h1>Welcome!</h1>
          </header>
          <div
            className="section"
            style={{
              backgroundColor: "#72b794",
              margin: "50px 50px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h1
                className="header"
                style={{
                  textAlign: "left",
                  margin: "10px",
                }}
              >
                My Events:
              </h1>
              <div
                style={{
                  marginLeft: "auto",
                  marginRight: "10px",
                }}
              >
                {/* TODO: Create new event page and "onclick" action */}
                <Button onClick={routeChange}>Create New Event</Button>
              </div>
            </div>
            <div className="event-list-container">
              <div className="event-list">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default ProfilePage;
