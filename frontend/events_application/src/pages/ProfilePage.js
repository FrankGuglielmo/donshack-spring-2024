import NavbarMain from "../components/Navbar";
import Footer from "../components/Footer";
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import EventCard from "../components/EventCard";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { getIdTokenClaims, isLoading, isAuthenticated, loginWithRedirect } =
    useAuth0();
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [curUserID, setCurUserID] = useState(null);

  const [events, setEvents] = useState([]);

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
                    setCurUserID(postResponse.data.id);
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

  // Function to fetch events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "https://contract-manager.aquaflare.io/events/"
      );
      const allEvents = response.data;

      const userEvents = allEvents.filter((e) => e.hosted_by === curUserID);
      setEvents(userEvents);
    } catch (error) {
      console.error("Fetching events failed: ", error);
    }
  };

  //   TODO: this *might* need to be updated every time events changes but maybe not idk let's see later?
  useEffect(() => {
    fetchEvents();
  }, [curUserID]); //dependency; every time curUserID changes, re-fetch events

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
                <Button
                  onClick={isAuthenticated ? routeChange : loginWithRedirect}
                >
                  Create New Event
                </Button>
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
