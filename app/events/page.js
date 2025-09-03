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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Upcoming Events</h1>
        <Link href="/events/calendar" className="btn btn-primary">Calendar View</Link>
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search events..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="row">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div key={event.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{event.date}{event.time ? ` at ${event.time}` : ''}</h6>
                  <p className="card-text">{event.description}</p>
                  <Link href={`/events/${event.id}`} className="btn btn-primary">View Details</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No events found matching your search.</p>
        )}
      </div>
    </div>
  );
}