import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";
import { IoMdDownload } from "react-icons/io";
import { IoIosWarning } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import ReportPhoto from "../components/ReportPhoto";
import "../styles/home.css";

function PhotoView() {
    const navigate = useNavigate();
    const location = useLocation();
    const { images, selectedIndex } = location.state;
    const [currentIndex, setCurrentIndex] = useState(selectedIndex || 0);
    const [isReportFormVisible, setIsReportFormVisible] = useState(false);

    const goToPhoto = (step) => setCurrentIndex((prevIndex) => (prevIndex + step + images.length) % images.length);
    const toggleReportForm = () => setIsReportFormVisible((isVisible) => !isVisible);

    const routeChange = () => {
        navigate('/event');
    };

    return (
        <main id="photo">
            <div className="photo-bg">
                <div className="btnGroup">
                    <button className="rightBtn" onClick={routeChange}>
                        <IoMdClose size={25} />
                        <h3>close</h3>
                    </button>
                    <div className="photo-number">{currentIndex + 1} / {images.length}</div>
                    <div className="rightBtns">
                        <button className="leftBtn" onClick={routeChange}>
                            <IoMdDownload size={25} />
                        </button>
                        <button id="warnBtn" onClick={toggleReportForm}>
                            <IoIosWarning size={25} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="btnGroup">
                <button className="leftBtn" onClick={() => goToPhoto(-1)}><IoIosArrowDropleftCircle size={25} /></button>
                {images && (
                    <div className="selectedPhoto">
                        <img src={images[currentIndex]} alt={`Event Photo ${currentIndex}`} />
                    </div>
                )}
                <button className="rightBtn" onClick={() => goToPhoto(1)}><IoIosArrowDroprightCircle size={25} /></button>
            </div>
            {isReportFormVisible && (
                <div className="report-overlay">
                    <div className="report-container">
                        <ReportPhoto image={images[currentIndex]} onClose={toggleReportForm} />
                    </div>
                </div>
            )}
        </main>
    )
}

export default PhotoView;