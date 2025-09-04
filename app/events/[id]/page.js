"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/events/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Event not found");
          }
          return res.json();
        })
        .then((data) => setEvent(data.event))
        .catch((err) => setError(err.message));
    }
  }, [id]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!event) {
    return <div>Loading event details...</div>;
  }

  // Helper function to format dates consistently
  const formatEventDate = (event) => {
    if (event.startDate && event.endDate) {
      const startDate = new Date(
        event.startDate + "T00:00:00"
      ).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "America/Chicago",
      });

      if (event.startDate === event.endDate) {
        // Same day event
        return startDate;
      } else {
        // Multi-day event
        const endDate = new Date(
          event.endDate + "T00:00:00"
        ).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "America/Chicago",
        });
        return (
          <>
            {startDate}
            <br className="d-sm-none" />
            <span className="d-none d-sm-inline"> - </span>
            <span className="d-sm-none text-muted"> to </span>
            {endDate}
          </>
        );
      }
    } else if (event.startDate) {
      return new Date(event.startDate + "T00:00:00").toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "America/Chicago",
        }
      );
    } else {
      return new Date(event.date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "America/Chicago",
      });
    }
  };

  const formatEventTime = (event) => {
    if (event.isWholeDayEvent) {
      return "All Day";
    } else if (event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    } else if (event.startTime) {
      return `${event.startTime}`;
    } else if (event.time) {
      return event.time;
    }
    return null;
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "12px" }}
          >
            <div className="card-body p-5">
              <h1 className="display-5 mb-3 fw-bold">{event.title}</h1>
              <p className="lead mb-4">{event.description}</p>

              <div className="event-details mb-4">
                <div className="row g-3">
                  <div className="col-12 col-lg-6">
                    <div className="detail-item">
                      <strong className="text-primary">📅 Date:</strong>
                      <div 
                        className="mt-1" 
                        style={{ 
                          wordBreak: 'break-word',
                          lineHeight: '1.4',
                          fontSize: '0.95rem',
                          overflowWrap: 'break-word',
                          hyphens: 'auto'
                        }}
                      >
                        {formatEventDate(event)}
                      </div>
                    </div>
                  </div>

                  {formatEventTime(event) && (
                    <div className="col-12 col-lg-6">
                      <div className="detail-item">
                        <strong className="text-primary">Time:</strong>
                        <div className="mt-1">{formatEventTime(event)}</div>
                      </div>
                    </div>
                  )}

                  {event.location && (
                    <div className="col-12 col-lg-6">
                      <div className="detail-item">
                        <strong className="text-primary">Location:</strong>
                        <div className="mt-1">{event.location}</div>
                      </div>
                    </div>
                  )}

                  {event.contact && (
                    <div className="col-12 col-lg-6">
                      <div className="detail-item">
                        <strong className="text-primary">Contact:</strong>
                        <div className="mt-1">{event.contact}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {event.fullDescription && (
                <>
                  <hr className="my-4" />
                  <div className="full-description">
                    <h5 className="mb-3">Event Details</h5>
                    <div className="text-muted" style={{ lineHeight: "1.6" }}>
                      {event.fullDescription}
                    </div>
                  </div>
                </>
              )}

              <div className="text-center mt-5">
                <a href="/events" className="btn btn-outline-primary px-4">
                  ← Back to Events
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
