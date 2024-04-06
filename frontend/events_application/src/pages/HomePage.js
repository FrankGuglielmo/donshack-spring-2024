import React from 'react';
import NavbarMain from '../components/Navbar';
import Footer from '../components/Footer';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function HomePage() {

    return (
        <main>
            <header>
                <NavbarMain />
            </header>
            <section className="home-blurb">
                <h2>Our App Intro, blah blah blah amazing photo app</h2>
                <p>HELLO WE ARE A PHOPTO UPLOADING APP BLAH BLAH BLAH BLAH BLAH BLAH BLAH BLAHB LAHB BLAHB ALBHALBJ  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci porta non pulvinar neque laoreet suspendisse interdum consectetur. Amet justo donec enim diam vulputate ut pharetra sit amet. In hac habitasse platea dictumst vestibulum rhoncus est.</p>
            </section>
            <div className="event-carousel text-center">
                <Card>
                    <Card.Header as="h5">Featured</Card.Header>
                    <Card.Body>
                        <Card.Title>Special title treatment</Card.Title>
                        <Card.Text>
                            With supporting text below as a natural lead-in to additional content.
                        </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
                </Card>
            </div>
            <footer>
                <Footer />
            </footer>
        </main>
    );
}

export default HomePage;