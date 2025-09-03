'use client';

import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        const formattedEvents = data.events.map(event => ({
          ...event,
          start: new Date(event.date),
          end: new Date(event.date),
        }));
        setEvents(formattedEvents);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  const handleSelectEvent = (event) => {
    router.push(`/events/${event.id}`);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading calendar events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Back Navigation */}
      <div className="mb-3">
        <Link href="/events" className="btn btn-outline-secondary btn-sm">
          ← Back to Events
        </Link>
      </div>

      {/* Page Hero Section */}
      <header className="page-hero row align-items-center justify-content-between mb-4 pb-3 border-bottom border-light">
        <div className="col-md-8">
          <h1 className="display-6 mb-2 fw-bold">Event Calendar</h1>
          <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
            View all upcoming events in calendar format
          </p>
        </div>
        <div className="col-md-4 text-md-end mt-3 mt-md-0">
          <div className="btn-group" role="group">
            <button
              className={`btn ${view === 'month' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
              onClick={() => handleViewChange('month')}
            >
              Month
            </button>
            <button
              className={`btn ${view === 'week' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
              onClick={() => handleViewChange('week')}
            >
              Week
            </button>
            <button
              className={`btn ${view === 'day' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
              onClick={() => handleViewChange('day')}
            >
              Day
            </button>
          </div>
        </div>
      </header>

      {/* Calendar Container */}
      <div className="calendar-container card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="card-body p-4">
          {events.length > 0 ? (
            <div className="calendar-wrapper" style={{ height: '600px' }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                onSelectEvent={handleSelectEvent}
                onNavigate={handleNavigate}
                onView={handleViewChange}
                date={date}
                view={view}
                popup
                style={{ height: '100%' }}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: '#3b82f6',
                    borderRadius: '6px',
                    border: 'none',
                    color: 'white',
                    fontSize: '0.875rem',
                    padding: '2px 6px',
                    cursor: 'pointer'
                  }
                })}
                dayPropGetter={(date) => {
                  const today = new Date();
                  const isToday = 
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();
                  
                  return {
                    style: {
                      backgroundColor: isToday ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    }
                  };
                }}
              />
            </div>
          ) : (
            <div className="empty-state text-center py-5">
              <div className="mb-4">
                <span className="display-1 text-muted">📅</span>
              </div>
              <h3 className="text-muted mb-3">No events scheduled</h3>
              <p className="text-muted mb-4">
                There are no events to display in the calendar at this time.
              </p>
              <a href="/events" className="btn btn-primary">
                View Events List
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Legend */}
      {events.length > 0 && (
        <div className="mt-4">
          <div className="row">
            <div className="col-md-6">
              <div className="card border-0 bg-light">
                <div className="card-body p-3">
                  <h6 className="card-title mb-2 fw-bold">📍 Navigation Tips</h6>
                  <ul className="list-unstyled mb-0 small text-muted">
                    <li>• Click on any event to view details</li>
                    <li>• Use the view buttons to switch between Month, Week, and Day views</li>
                    <li>• Navigate using the calendar controls</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-3 mt-md-0">
              <div className="card border-0 bg-light">
                <div className="card-body p-3">
                  <h6 className="card-title mb-2 fw-bold">📊 Event Summary</h6>
                  <p className="mb-0 small text-muted">
                    <strong>{events.length}</strong> event{events.length !== 1 ? 's' : ''} scheduled
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
