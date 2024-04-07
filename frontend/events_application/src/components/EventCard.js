import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventCard({ event }) {
  const navigate = useNavigate();

  const routeChange = () => {
    navigate(`/event/${event.title}`);
  };

  return (
    <div
      className='event-card'
      onClick={routeChange}
      style={{
        backgroundImage: `url(${event.cover_photo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.5,
      }}
    >
      <div className='event-card-content'>
        <h3>{event.title}</h3>
        <p>{new Date(event.date).toDateString()}</p>
      </div>
    </div>
  );
}