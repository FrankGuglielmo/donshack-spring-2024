import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";
import { IoMdDownload } from "react-icons/io";
import { IoIosWarning } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import "../styles/home.css";

function PhotoView() {
    const navigate = useNavigate();
    const location = useLocation();
    const { images, selectedIndex } = location.state;
    const [currentIndex, setCurrentIndex] = useState(selectedIndex || 0);

    const routeChange = () => {
        navigate('/event');
    };

    const goToNextPhoto = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1) % images.length);
    };

    const goToPreviousPhoto = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1 + images.length) % images.length);
    };

    return (
        <main id="photo">
            <div className="photo-bg">
                <div className="btnGroup">
                    <button className="rightBtn" onClick={routeChange}>
                        <IoMdClose size={25} />
                        <h3>close</h3>
                    </button>
                    <div className="photo-number">
                        {currentIndex + 1} / {images.length}
                    </div>
                    <div className="rightBtns">
                        <button className="leftBtn" onClick={routeChange}>
                            <IoMdDownload size={25} />
                        </button>
                        <button id="warnBtn" onClick={routeChange}>
                            <IoIosWarning size={25} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="btnGroup">
                <button className="leftBtn" onClick={goToNextPhoto}><IoIosArrowDropleftCircle size={25} /></button>
                {images && (
                    <div className="selectedPhoto">
                        <img src={images[currentIndex]} alt={`Event Photo ${currentIndex}`} />
                    </div>
                )}
                <button className="rightBtn" onClick={goToPreviousPhoto}><IoIosArrowDroprightCircle size={25} /></button>
            </div>
        </main>
    )
}

export default PhotoView;