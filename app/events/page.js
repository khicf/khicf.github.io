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
    <div className="container py-4">
      {/* Page Hero Section */}
      <header className="page-hero row align-items-center justify-content-between mb-4 pb-3 border-bottom border-light">
        <div className="col-md-8">
          <h1 className="display-6 mb-2 fw-bold">Upcoming Events</h1>
          <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
            Join us for fellowship and community gatherings
          </p>
        </div>
        <div className="col-md-4 text-md-end mt-3 mt-md-0">
          <Link
            href="/events/calendar"
            className="btn btn-primary"
            style={{ fontSize: '0.95rem', padding: '0.5rem 1.25rem' }}
          >
            Calendar View
          </Link>
        </div>
      </header>

      {/* Controls Bar */}
      <div className="controls-bar row g-3 align-items-center mb-4">
        <div className="col-md-8">
          <div className="position-relative">
            <input
              type="text"
              className="form-control pe-5"
              placeholder="Search events..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ fontSize: '0.95rem', padding: '0.65rem 1rem' }}
            />
            {searchTerm && (
              <button
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                style={{ zIndex: 5 }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
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
          <div className="empty-state text-center py-5 col-12">
            <div className="mb-4">
              <span className="display-1 text-muted">📅</span>
            </div>
            <h3 className="text-muted mb-3">No events found</h3>
            <p className="text-muted mb-4">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "Check back soon for upcoming community gatherings!"}
            </p>
            {searchTerm && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}