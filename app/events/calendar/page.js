'use client';

import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useRouter } from 'next/navigation';

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Event Calendar</h1>
      <div style={{ height: '500pt'}}>
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
        />
      </div>
    </div>
  );
}
