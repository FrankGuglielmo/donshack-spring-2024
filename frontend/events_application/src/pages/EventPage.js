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
  // event media state initialized, will eventually be loaded up with event photos
  const [eventMedia, setEventMedia] = useState([]);
  // state of photo gallery per event for smooth scrolling
  const eventGalleryRef = useRef(null);
  // used in order to grab correct url for events/photos from db
  const navigate = useNavigate();
  // set param, eventId to navigate each event and keep state
  const { eventId } = useParams();
  // maintains objects used within the previous state
  const location = useLocation();
  // retrieve event details or set to empty object if undefined
  const { event } = location.state || {};
  // css hover state
  const [hover, setHover] = useState(false);

  useEffect(() => {
    // Import config module
    import("../config").then((configModule) => {
      const config = configModule.default;
      
      // function that fetches for all photos for specified event ID and updates state
      const fetchEventMedia = async () => {
        try {
          // fetching from API using config
          const response = await fetch(
            `${config.apiUrl}/events/${eventId}/media-uploads`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include'
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          // map through data retrieved and update state 
          const mediaUrls = data.map((media) => media.s3_url);
          setEventMedia(mediaUrls);
        } catch (error) {
          console.error("Failed to fetch event media", error);
        }
      };

      // function to fetch all specific event metadata
      const fetchEventData = async () => {
        try {
          // fetching specific event using config
          const response = await fetch(
            `${config.apiUrl}/events/${eventId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include'
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const eventData = await response.json();
        } catch (error) {
          console.error("Failed to fetch event data", error);
        }
      };
      
      // Execute fetch functions
      fetchEventMedia();
      if (!event) {
        fetchEventData();
      }
    });
  }, [eventId, event]);

  // function to bring user to photo route for PhotoView.js file
  const handlePhotoClick = (selectedIndex) => {
    const selectedMediaUrl = eventMedia[selectedIndex];
    // navigates url of specified
    navigate(
      `/photo/${encodeURIComponent(selectedMediaUrl)}?eventId=${eventId}`,
      { state: { images: eventMedia, selectedIndex, eventId, event } }
    );
  };

  // style function for buttons
  const style = {
    backgroundColor: hover ? '#C75222' : '#EF8356',
    border: '1px solid #FF6B2D',
    cursor: 'pointer',
  };

  // smooth scrolling functionality
  const scrollToGallery = () => {
    eventGalleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // function for uploading photo to an event and posting it to the backend
  const handleFileSelect = async (file) => {
    console.log("Selected file:", file);
    console.log("eventid:", eventId);
    try {
      // formating data for push
      const formData = new FormData();
      formData.append("upload", file);
      formData.append("event", eventId);

      console.log(formData);

      // posting data to db url
      // Import config for API URL
      const config = (await import("../config")).default;
      
      await axios
        .post(
          `${config.apiUrl}/media_uploads/`,
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
          // adding new photo URL to the eventMedia state to render dynamically on page
          setEventMedia([...eventMedia, uploadedPhotoUrl]);
        })
        .catch((error) => {
          console.error("Error uploading photo:", error);
          console.log("Server Response:", error.response.data);
        });
    } catch (error) {
      console.error("Failed to build image object:", error);
    }
  };

  // functionality to open pop up when user requests to upload an image
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
        {/* slide show component call with fetched display title and description */}
        <Slideshow images={eventMedia} />
        <div className="overlay">
          <section id="event-blurb" style={{ color: 'white' }}>
            <h2>{event.title}</h2>
            <br />
            <p style={{ color: 'white' }}> {event.description}</p>
          </section>
          {/* button to scroll down to photo gallery */}
          <button className="scroll-down-btn" onClick={scrollToGallery}>
            <FaArrowDown size={25} />
          </button>
        </div>
      </div>
      {/* photo gallery */}
      <section id="event-gallery" ref={eventGalleryRef}>
        <div className="d-flex justify-content-end">
          {/* adding photo button */}
          <Button className="add-photo-btn mt-2" style={style}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={openPopup}>
            Add Your Photos
          </Button>
        </div>
        <div className="photo-container">
          <div className="photo-gallery">
            {/* mapping through media to display all photos from specified event */}
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
      {/* <footer>
        <Footer />
      </footer> */}
    </main>
  );
}

export default EventPage;
