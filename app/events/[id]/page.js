'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/events/${id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Event not found');
          }
          return res.json();
        })
        .then(data => setEvent(data.event))
        .catch(err => setError(err.message));
    }
  }, [id]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!event) {
    return <div>Loading event details...</div>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <p className="lead">{event.description}</p>
      <hr />
      <p><strong>Date:</strong> {event.date}</p>
      {event.time && <p><strong>Time:</strong> {event.time}</p>}
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Contact:</strong> {event.contact}</p>
      <p>{event.fullDescription}</p>
    </div>
  );
}
