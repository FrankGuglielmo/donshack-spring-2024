import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventCard() {
    // navigation hooke
    const navigate = useNavigate(); 

    // navigate to the event page
    const routeChange = () => {
        navigate('../pages/Event');
    };

    return (
        <div>
            <button className="event-card" onClick={routeChange}>
                <h3>DONS Hack 2024</h3>
                <p>04/06/2024 - 04/07/2024</p>
            </button>
        </div>
    );
}
