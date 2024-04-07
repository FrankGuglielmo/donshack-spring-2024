import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NavbarMain from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "react-bootstrap/Button";
import Slideshow from "../components/Slideshow";
import { FaArrowDown } from "react-icons/fa";
import "../styles/home.css";
import axios from "axios";

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
        const response = await fetch(
          `https://contract-manager.aquaflare.io/events/${eventId}/media-uploads`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const mediaUrls = data.map((media) => media.s3_url);
        setEventMedia(mediaUrls);
      } catch (error) {
        console.error("Failed to fetch event media", error);
      }
    };

    const fetchEventData = async () => {
      try {
        const response = await fetch(
          `https://contract-manager.aquaflare.io/events/${eventId}`
        );
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
    navigate(
      `/photo/${encodeURIComponent(selectedMediaUrl)}?eventId=${eventId}`,
      { state: { images: eventMedia, selectedIndex, eventId, event } }
    );
  };

  const scrollToGallery = () => {
    eventGalleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileSelect = async (file) => {
    console.log("Selected file:", file);
    console.log("eventid:", eventId);
    try {
      const formData = new FormData();
      formData.append("upload", file);
      formData.append("event", eventId);

      console.log(formData);

      await axios
        .post(
          `https://contract-manager.aquaflare.io/media_uploads/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          console.log("Uploaded successfully!");
          const uploadedPhotoUrl = response.data.s3_url;
          setEventMedia([...eventMedia, uploadedPhotoUrl]); // Add the new photo URL to the eventMedia state to render dynamically on page
        })
        .catch((error) => {
          console.error("Error uploading photo:", error);
          console.log("Server Response:", error.response.data);
        });
    } catch (error) {
      console.error("Failed to build image object:", error);
    }
  };

  const openPopup = () => {
    const isConfirmed = window.confirm("Upload an image?");
    if (isConfirmed) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (event) => handleFileSelect(event.target.files[0]);
      input.click();
    }
  };

  return (
    <main>
      <header>
        <NavbarMain />
      </header>
      <div className="photo-grid-display">
        <Slideshow images={eventMedia} />
        <div className="overlay">
          <section id="home-blurb">
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
          {/* TODO: Upload media
                    1. Popup?
                    2. update db */}
          <Button onClick={openPopup}>Add Your Photo</Button>
        </div>
        <div className="photo-container">
          <div className="photo-gallery">
            {eventMedia.length > 0 ? (
              eventMedia.map((upload, index) => (
                <button
                  className="photo"
                  key={index}
                  onClick={() => handlePhotoClick(index)}
                >
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
