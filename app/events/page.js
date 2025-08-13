'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setAllEvents(data.events);
        setFilteredEvents(data.events);
      });
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = allEvents.filter(event =>
      event.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      event.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      event.location.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredEvents(results);
  }, [searchTerm, allEvents]);

  return (
    <div>
      <h1>Upcoming Events</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search events..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="list-group">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <Link href={`/events/${event.id}`} key={event.id} className="list-group-item list-group-item-action flex-column align-items-start">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{event.title}</h5>
                <small>{event.date} at {event.time}</small>
              </div>
              <p className="mb-1">{event.description}</p>
            </Link>
          ))
        ) : (
          <p className="text-muted">No events found matching your search.</p>
        )}
      </div>
    </div>
  );
}