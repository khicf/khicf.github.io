'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [latestEvents, setLatestEvents] = useState([]);
  const [recentPrayers, setRecentPrayers] = useState([]);
  const [recentScriptures, setRecentScriptures] = useState([]);

  useEffect(() => {
    // Fetch Latest Events
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setLatestEvents(data.events.slice(0, 3))); // Get top 3

    // Fetch Recent Prayer Requests
    fetch('/api/prayers?public=true')
      .then(res => res.json())
      .then(data => setRecentPrayers(data.prayers.slice(0, 3))); // Get top 3

    // Fetch Recent Scripture Shares
    fetch('/api/scriptures')
      .then(res => res.json())
      .then(data => setRecentScriptures(data.scriptures.slice(0, 3))); // Get top 3
  }, []);

  return (
    <div>
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Welcome to the ICF Community Hub</h1>
          <p className="col-md-8 fs-4">A place to connect, share, and grow together. Find event information, share prayer requests, and be encouraged by scripture.</p>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Events Calendar</h5>
              <p className="card-text">Check out our upcoming events and gatherings.</p>
              <Link href="/events" className="btn btn-primary">View Events</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Prayer Wall</h5>
              <p className="card-text">Share your prayer requests and pray for others in the community.</p>
              <Link href="/prayer" className="btn btn-primary">Visit Prayer Wall</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Scripture Feed</h5>
              <p className="card-text">Be encouraged by God's word shared by fellow members.</p>
              <Link href="/scripture" className="btn btn-primary">View Scripture Feed</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <h2>Latest Events</h2>
          {latestEvents.length > 0 ? (
            <ul className="list-group mb-3">
              {latestEvents.map(event => (
                <Link href={`/events/${event.id}`} key={event.id} className="list-group-item list-group-item-action">
                  <strong>{event.title}</strong><br />
                  <small>{event.date} at {event.time}</small>
                </Link>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No upcoming events.</p>
          )}
          <Link href="/events" className="btn btn-outline-primary btn-sm">View All Events</Link>
        </div>

        <div className="col-md-4">
          <h2>Recent Prayer Requests</h2>
          {recentPrayers.length > 0 ? (
            <ul className="list-group mb-3">
              {recentPrayers.map(prayer => (
                <li key={prayer.id} className="list-group-item">
                  <strong>{prayer.request}</strong><br />
                  <small>By {prayer.author || 'Anonymous'} on {new Date(prayer.date).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No recent prayer requests.</p>
          )}
          <Link href="/prayer" className="btn btn-outline-primary btn-sm">View All Prayers</Link>
        </div>

        <div className="col-md-4">
          <h2>Recent Scripture Shares</h2>
          {recentScriptures.length > 0 ? (
            <ul className="list-group mb-3">
              {recentScriptures.map(scripture => (
                <li key={scripture.id} className="list-group-item">
                  <strong>{scripture.reference}</strong><br />
                  <small>By {scripture.author} on {new Date(scripture.date).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No recent scripture shares.</p>
          )}
          <Link href="/scripture" className="btn btn-outline-primary btn-sm">View All Scriptures</Link>
        </div>
      </div>
    </div>
  );
}
