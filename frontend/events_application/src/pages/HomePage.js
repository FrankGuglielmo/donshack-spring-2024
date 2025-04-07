import React, { useState } from "react";
import NavbarMain from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "react-bootstrap/Button";
import EventCard from "../components/EventCard";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import useFetchEvents from "../hooks/FetchEvents";
import "../styles/home.css";

function HomePage() {
  // hook that returns navigation prop
  // use for route change w/ create event button
  const navigate = useNavigate();
  // auth0 state used to check whether signed in or signed out
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  // event states to store fetched db data
  const [events, setEvents] = useState([]);
  // hover state css for buttons
  const [hover, setHover] = useState(false);

  useFetchEvents(setEvents);

  // route change to create an event
  const routeChange = () => {
    navigate(`/createEvent`);
  };

  // style function for buttons
  const style = {
    backgroundColor: hover ? '#196866' : '#267c7a',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease-in-out',
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
          <hr></hr>
          <div className="buttons">
            {/* list of all total events in db */}
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
              {/* event card component call for each individual event*/}
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
