import React, { useState, useEffect } from "react";
import NavbarMain from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import EventCard from "../components/EventCard";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function HomePage() {
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

  return (
    <main>
      <header>
        <NavbarMain />
      </header>
      <section id="home-blurb">
        <h2>Our App Intro, blah blah blah amazing photo app</h2>
        <p>
          HELLO WE ARE A PHOPTO UPLOADING APP BLAH BLAH BLAH BLAH BLAH BLAH BLAH
          BLAHB LAHB BLAHB ALBHALBJ sed do eiusmod tempor incididunt ut labore
          et dolore magna aliqua. Orci porta non pulvinar neque laoreet
          suspendisse interdum consectetur. Amet justo donec enim diam vulputate
          ut pharetra sit amet. In hac habitasse platea dictumst vestibulum
          rhoncus est.
        </p>
      </section>
      <section id="events">
        <section>
          <div className="buttons">
            <DropdownButton
              as={ButtonGroup}
              title="Filter"
              id="bg-nested-dropdown"
            >
              <Dropdown.Item eventKey="1">Date</Dropdown.Item>
              <Dropdown.Item eventKey="2">Location</Dropdown.Item>
            </DropdownButton>
            <Button variant="primary" className="create-event-btn">
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
