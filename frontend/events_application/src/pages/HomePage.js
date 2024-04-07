import React, { useState, useEffect } from "react";
import NavbarMain from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "react-bootstrap/Button";
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/home.css";

function HomePage() {
  const navigate = useNavigate();
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const [events, setEvents] = useState([]);
  const [hover, setHover] = useState(false);

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

  const routeChange = () => {
    navigate(`/createEvent`);
  };

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
      <section id="home-blurb">
        <h1>Clixz</h1>
        <p>
          Here at Clixz we are more than a photo-sharing app; we're a community focused on spotlighting social justice and urban connectivity through the lens of those who live it. You are both the witness and the storyteller. Help spark dialogues, build bridges, and ignite action in your community. Every click is a story.
        </p>
      </section>
      <section id="events">
        <section>
          <div className="buttons">
            <h2> Events: </h2>
            <Button
              className="create-event-btn"
              style={style}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onClick={isAuthenticated ? routeChange : loginWithRedirect}
            >
              Create New Event
            </Button>
          </div>
          <div className="event-list-container">
            <div className="event-list">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      </section>
      <footer>
        <Footer />
      </footer>
    </main>
  );
}

export default HomePage;
