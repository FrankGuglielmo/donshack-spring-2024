import React, { useState, useEffect } from 'react';

// Slideshow functionality for images on event pages
export default function Slideshow({ images }) {
    // using set state for current img
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // changing image every 5 seconds
        const interval = setInterval(() => {
            setIndex((currentIndex) => (currentIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="slideshow">
            
            {images.map((image, i) => (
                <img
                    key={i}
                    src={image}
                    alt={`Slide ${i}`}
                    style={{
                        opacity: index === i ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        // cover will fill entire container w/ img
                        // contain with contain the photo with white space
                        objectFit: 'cover'
                    }}
                />
            ))}
        </div>
    );
}
