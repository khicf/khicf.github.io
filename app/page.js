"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [latestEvents, setLatestEvents] = useState([]);
  const [recentPrayers, setRecentPrayers] = useState([]);
  const [recentScriptures, setRecentScriptures] = useState([]);

  useEffect(() => {
    // Fetch Latest Events
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setLatestEvents(data.events.slice(0, 3))); // Get top 3

    // Fetch Recent Prayer Requests
    fetch("/api/prayers?public=true")
      .then((res) => res.json())
      .then((data) => setRecentPrayers(data.prayers.slice(0, 3))); // Get top 3

    // Fetch Recent Scripture Shares
    fetch("/api/scriptures")
      .then((res) => res.json())
      .then((data) => setRecentScriptures(data.scriptures.slice(0, 3))); // Get top 3
  }, []);

  return (
    <div>
      <div className="container-fluid bg-light py-5 text-center">
        <h1 className="display-5 fw-bold">Welcome to the ICF Community Hub</h1>
        <p className="fs-4">Every Nation, Every Tribe, Every Tongue.</p>
        {/* <p>Welcome-欢迎-Bienvenidos-환영-E'Kabo-ようこそ-Bienvenue</p> */}
        {/* <p>
          <a
            href="https://www.uiucicf.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit our website
          </a>
        </p> */}
      </div>

      <div className="container my-5">
        <div className="row">
          <div className="col-md-12">
            <h2>Latest Updates</h2>
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Latest Events</h5>
                    {latestEvents.length > 0 ? (
                      <ul className="list-group list-group-flush">
                        {latestEvents.map((event) => (
                          <li key={event.id} className="list-group-item">
                            <Link
                              href={`/events/${event.id}`}
                              className="text-decoration-none"
                            >
                              <strong>{event.title}</strong>
                              <br />
                              <small className="text-muted">
                                {event.date} at {event.time}
                              </small>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No upcoming events.</p>
                    )}
                  </div>
                  <div className="card-footer">
                    <Link href="/events" className="btn btn-primary btn-sm">
                      View All Events
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Recent Prayers</h5>
                    {recentPrayers.length > 0 ? (
                      <ul className="list-group list-group-flush">
                        {recentPrayers.map((prayer) => (
                          <li key={prayer.id} className="list-group-item">
                            <strong>{prayer.request}</strong>
                            <br />
                            <small className="text-muted">
                              By {prayer.author || "Anonymous"} on{" "}
                              {new Date(prayer.date).toLocaleDateString()}
                            </small>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No recent prayer requests.</p>
                    )}
                  </div>
                  <div className="card-footer">
                    <Link href="/prayer" className="btn btn-primary btn-sm">
                      View All Prayers
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Recent Scriptures</h5>
                    {recentScriptures.length > 0 ? (
                      <ul className="list-group list-group-flush">
                        {recentScriptures.map((scripture) => (
                          <li key={scripture.id} className="list-group-item">
                            <strong>{scripture.reference}</strong>
                            <br />
                            <small className="text-muted">
                              By {scripture.author} on{" "}
                              {new Date(scripture.date).toLocaleDateString()}
                            </small>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No recent scripture shares.</p>
                    )}
                  </div>
                  <div className="card-footer">
                    <Link href="/scripture" className="btn btn-primary btn-sm">
                      View All Scriptures
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
