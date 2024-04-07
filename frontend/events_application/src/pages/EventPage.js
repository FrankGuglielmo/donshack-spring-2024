import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import NavbarMain from '../components/Navbar';
import Footer from '../components/Footer';
import Button from 'react-bootstrap/Button';
import Slideshow from '../components/Slideshow';
import { FaArrowDown } from 'react-icons/fa';
import "../styles/home.css";

function EventPage() {
    const [eventMedia, setEventMedia] = useState([]);
    const eventGalleryRef = useRef(null);
    const navigate = useNavigate();
    const { eventId } = useParams(); // Corrected import from react-router-dom
    const location = useLocation();
    const { event } = location.state || {}; // Retrieve event details or set to empty object if undefined

    useEffect(() => {
        const fetchEventMedia = async () => {
            try {
                const response = await fetch(`https://contract-manager.aquaflare.io/events/${eventId}/media-uploads`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const mediaUrls = data.map(media => media.s3_url);
                setEventMedia(mediaUrls);
            } catch (error) {
                console.error("Failed to fetch event media", error);
            }
        };

        const fetchEventData = async () => {
            try {
                const response = await fetch(`https://your-api-endpoint/events/${eventId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const eventData = await response.json();
                // Update your state with the fetched event data
            } catch (error) {
                console.error("Failed to fetch event data", error);
            }
        };

        fetchEventMedia();
        if (!event) {
            fetchEventData();
        }
    }, [eventId, event]);

    const handlePhotoClick = (selectedIndex) => {
        const selectedMediaUrl = eventMedia[selectedIndex]; // already a URL string
        navigate(`/photo/${encodeURIComponent(selectedMediaUrl)}?eventId=${eventId}`, { state: { images: eventMedia, selectedIndex, eventId, event } });
    };

    const scrollToGallery = () => {
        eventGalleryRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main>
            <header>
                <NavbarMain />
            </header>
            <div className="photo-grid-display">
                <Slideshow images={eventMedia} />
                <div className="overlay">
                    <section id="event-blurb">
                        <h2>{event.title}</h2>
                        <br />
                        <p>{event.description}</p>
                    </section>
                    <button className="scroll-down-btn" onClick={scrollToGallery}>
                        <FaArrowDown size={25} />
                    </button>
                </div>
            </div>
            <section id="event-gallery" ref={eventGalleryRef}>
                <div className="d-flex justify-content-end">
                    <Button variant="primary" className="add-photo-btn mt-2">Add Your Photos</Button>
                </div>
                <div className="photo-container">
                    <div className="photo-gallery">
                        {eventMedia.length > 0 ? (
                            eventMedia.map((upload, index) => (
                                <button className="photo" key={index} onClick={() => handlePhotoClick(index)}>
                                    <img src={upload} alt={`Event Photo ${index + 1}`} />
                                </button>
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
    );
}

export default EventPage;