"use client";

import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
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
  const [view, setView] = useState("month");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        const formattedEvents = data.events.map((event) => {
          // Use startDate and endDate if available, otherwise fall back to date
          let startDate, endDate, allDay = true;
          
          // Check if it's explicitly marked as a whole day event or has no time information
          const isWholeDayEvent = event.isWholeDayEvent || 
                                 (!event.startTime && !event.endTime && !event.time);
          
          if (event.startDate && event.endDate) {
            // Use the new start and end date fields
            if (isWholeDayEvent) {
              startDate = new Date(event.startDate + 'T00:00:00-06:00');
              endDate = new Date(event.endDate + 'T00:00:00-06:00');
              allDay = true;
            } else {
              let startTimeStr = event.startTime || '00:00:00';
              let endTimeStr = event.endTime || '23:59:59';
              
              startDate = new Date(event.startDate + 'T' + startTimeStr + '-06:00');
              endDate = new Date(event.endDate + 'T' + endTimeStr + '-06:00');
              allDay = false;
            }
          } else if (event.startDate) {
            // Only start date provided, make it a single day event
            if (isWholeDayEvent) {
              startDate = new Date(event.startDate + 'T00:00:00-06:00');
              endDate = new Date(event.startDate + 'T00:00:00-06:00');
              allDay = true;
            } else {
              let startTimeStr = event.startTime || '00:00:00';
              startDate = new Date(event.startDate + 'T' + startTimeStr + '-06:00');
              endDate = new Date(event.startDate + 'T' + startTimeStr + '-06:00');
              allDay = false;
            }
          } else {
            // Fall back to legacy date field
            startDate = new Date(event.date + 'T00:00:00-06:00');
            endDate = new Date(event.date + 'T00:00:00-06:00');
            allDay = isWholeDayEvent;
          }
          
          return {
            ...event,
            start: startDate,
            end: endDate,
            allDay: allDay
          };
        });
        setEvents(formattedEvents);
        setLoading(false);
      })
      .catch((err) => {
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


  if (loading) {
    return (
      <div className="container py-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "60vh" }}
        >
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
          <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>
            View all upcoming events in calendar format
          </p>
        </div>
        <div className="col-md-4 text-md-end mt-3 mt-md-0">
        </div>
      </header>

      {/* Calendar Container */}
      <div
        className="calendar-container card border-0 shadow-sm"
        style={{ borderRadius: "12px" }}
      >
        <div className="card-body p-4">
          {events.length > 0 ? (
            <div className="calendar-wrapper" style={{ height: "600px" }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                onSelectEvent={handleSelectEvent}
                onNavigate={handleNavigate}
                views={['month']}
                date={date}
                view={view}
                popup
                style={{ height: "100%" }}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: "#3b82f6",
                    borderRadius: "6px",
                    border: "none",
                    color: "white",
                    fontSize: "0.875rem",
                    padding: "2px 6px",
                    cursor: "pointer",
                  },
                })}
                dayPropGetter={(date) => {
                  const today = new Date();
                  const isToday =
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();

                  return {
                    style: {
                      backgroundColor: isToday
                        ? "rgba(59, 130, 246, 0.1)"
                        : "transparent",
                    },
                  };
                }}
              />
            </div>
          ) : (
            <div className="empty-state text-center py-5">
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
    </div>
  );
}
