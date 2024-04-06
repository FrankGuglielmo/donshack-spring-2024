import { useState, useEffect, useRef } from "react";
import NavbarMain from '../components/Navbar';
import Footer from '../components/Footer';
import Button from 'react-bootstrap/Button';
import Slideshow from '../components/Slideshow';
import { FaArrowDown } from 'react-icons/fa';
import "../styles/home.css";

function EventPage() {
    const eventGalleryRef = useRef(null);

    const scrollToGallery = () => {
        eventGalleryRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // TEST array of images
    const images = [
        'https://via.placeholder.com/250',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/350',
        'https://via.placeholder.com/750',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/250',
        'https://via.placeholder.com/450',
        'https://via.placeholder.com/250'
    ];

    return (
        <main>
            <header>
                <NavbarMain />
            </header>
            <div className="photo-grid-display">
                <Slideshow images={images} />
                <div className="overlay">
                    <section id="home-blurb">
                        <h2>DONS Hack 2024</h2>
                        <br/>
                        <p>DONS Hack 2024 was an event associated with the University of San Francisco. It was hosted by two on-campus clubs, WIT & ACM. The event last from April 06, 2024 to April 08, 2024. This event was a Hackathon, which is a rigorous coding competition where students are given a short amount of time to develop some kind of application. Good Luck Students!</p>
                    </section>
                    <button className="scroll-down-btn" onClick={scrollToGallery}>
                        <FaArrowDown size={25} />
                    </button>
                </div>
            </div>
            <section id="event-gallery" ref={eventGalleryRef}>
                <div className="d-flex justify-content-end">
                    <Button variant="primary" className="add-photo-btn">
                        Add Your Photos
                    </Button>
                </div>
                <div className="photo-container">
                    <div className="photo-gallery">
                        {images.length > 0 ? (
                            images.map((image, index) => (
                                <div className="photo" key={index}>
                                    <img src={image} alt={`Event Photo ${index + 1}`} />
                                </div>
                            ))
                        ) : (
                            <h3 id="noImg">There are no current photos for this event.</h3>
                        )}
                    </div>
                </div>
            </section>
            <footer>
                <Footer />
            </footer>
        </main>
    )
}

export default EventPage;