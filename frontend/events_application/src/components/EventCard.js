import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventCard({ event }) {
  const navigate = useNavigate();

  // route of event
  const routeChange = () => {
    navigate(`/event/${event.id}`, { state: { event } });
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
        opacity: 0.8,
      }}
    >
      <div className='event-card-content'>
        <h3>{event.title}</h3>
        <p style={{color: 'white'}} >{new Date(event.date).toDateString()}</p>
      </div>
    </div>
  );
}