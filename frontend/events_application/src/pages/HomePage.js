import React from 'react';
import NavbarMain from '../components/Navbar';
import Footer from '../components/Footer';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import "../styles/home.css";

function HomePage() {

    return (
        <main>
            <header>
                <NavbarMain />
            </header>
            <section id="home-blurb">
                <h2>Our App Intro, blah blah blah amazing photo app</h2>
                <p>HELLO WE ARE A PHOPTO UPLOADING APP BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAHB LAHB BLAHB ALBHALBJ  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci porta non pulvinar neque laoreet suspendisse interdum consectetur. Amet justo donec enim diam vulputate ut pharetra sit amet. In hac habitasse platea dictumst vestibulum rhoncus est.</p>
            </section>
            <section id="events">
                <section>
                    <div className='buttons'>
                        <DropdownButton as={ButtonGroup} title="Dropdown" id="bg-nested-dropdown">
                            <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                            <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                        </DropdownButton>
                        <Button variant="primary" className="create-event-btn">
                            Create New Event
                        </Button>
                    </div>
                    <div className="event-list-container">
                        <div className="event-list">
                            <div className="event-card">
                                <h3>DONS Hack 2024</h3>
                                <br/>
                                <p>04/06/2024 - 04/07/2024</p>
                            </div>
                            <div className="event-card">
                                <h3>DONS Hack 2024</h3>
                                <br/>
                                <p>04/06/2024 - 04/07/2024</p>
                            </div>
                            <div className="event-card">
                                <h3>DONS Hack 2024</h3>
                                <br/>
                                <p>04/06/2024 - 04/07/2024</p>
                            </div>
                            <div className="event-card">
                                <h3>DONS Hack 2024</h3>
                                <br/>
                                <p>04/06/2024 - 04/07/2024</p>
                            </div>
                            <div className="event-card">
                                <h3>DONS Hack 2024</h3>
                                <br/>
                                <p>04/06/2024 - 04/07/2024</p>
                            </div>
                            <div className="event-card">
                                <h3>DONS Hack 2024</h3>
                                <br/>
                                <p>04/06/2024 - 04/07/2024</p>
                            </div>
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