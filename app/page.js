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
    <div className="container py-4">
      {/* Enhanced Hero Section */}
      <header className="hero-section text-center mb-5" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '4rem 2rem',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        <div className="position-relative">
          <div className="mb-4">
            <span style={{ fontSize: '3rem' }}>🏠</span>
          </div>
          <h1 className="display-4 mb-3 fw-bold" style={{ color: 'white' }}>
            Welcome to the ICF Community Hub
          </h1>
          <p className="fs-3 mb-4" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '300' }}>
            Every Nation, Every Tribe, Every Tongue
          </p>
          <p className="fs-5 mb-4" style={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
            Welcome • 欢迎 • Bienvenidos • 환영 • E'Kabo • ようこそ • Bienvenue
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-4">
            <Link href="/events" className="btn btn-light btn-lg" style={{
              borderRadius: '25px',
              padding: '0.75rem 2rem',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              📅 Upcoming Events
            </Link>
            <Link href="/prayer" className="btn btn-outline-light btn-lg" style={{
              borderRadius: '25px',
              padding: '0.75rem 2rem',
              fontWeight: '600',
              borderWidth: '2px'
            }}>
              🙏 Prayer Wall
            </Link>
          </div>
        </div>
      </header>

      {/* Latest Updates Section */}
      <div className="latest-updates-section">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold mb-3" style={{ color: '#343a40' }}>
            What's Happening in Our Community
          </h2>
          <p className="text-muted fs-5 mb-0">
            Stay connected with the latest events, prayers, and scripture shares
          </p>
        </div>
        
        <div className="row g-4">
          {/* Latest Events Card */}
          <div className="col-lg-4 mb-4">
            <div className="card h-100 border-0 shadow-sm home-card" style={{
              borderRadius: '12px'
            }}>
              <div className="card-header bg-transparent border-0 pt-4 pb-0">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                    <span style={{ fontSize: '1.5rem' }}>📅</span>
                  </div>
                  <h5 className="card-title mb-0 fw-bold">Latest Events</h5>
                </div>
              </div>
              <div className="card-body pt-0">
                <div className="content-area" style={{ minHeight: '200px' }}>
                  {latestEvents.length > 0 ? (
                    <div className="space-y-3">
                      {latestEvents.map((event, index) => (
                        <div key={event.id} className="border-bottom pb-3 mb-3" style={index === latestEvents.length - 1 ? {border: 'none', paddingBottom: 0, marginBottom: 0} : {}}>
                          <Link
                            href={`/events/${event.id}`}
                            className="text-decoration-none"
                          >
                            <h6 className="fw-bold text-dark mb-1">{event.title}</h6>
                            <p className="text-muted small mb-0">
                              📍 {event.date} at {event.time}
                            </p>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>📅</div>
                      <p className="text-muted mb-0">No upcoming events</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer bg-transparent border-0">
                <Link href="/events" className="btn btn-outline-primary btn-sm rounded-pill px-4">
                  View All Events →
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Prayers Card */}
          <div className="col-lg-4 mb-4">
            <div className="card h-100 border-0 shadow-sm home-card" style={{
              borderRadius: '12px'
            }}>
              <div className="card-header bg-transparent border-0 pt-4 pb-0">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                    <span style={{ fontSize: '1.5rem' }}>🙏</span>
                  </div>
                  <h5 className="card-title mb-0 fw-bold">Recent Prayers</h5>
                </div>
              </div>
              <div className="card-body pt-0">
                <div className="content-area" style={{ minHeight: '200px' }}>
                  {recentPrayers.length > 0 ? (
                    <div className="space-y-3">
                      {recentPrayers.map((prayer, index) => (
                        <div key={prayer.id} className="border-bottom pb-3 mb-3" style={index === recentPrayers.length - 1 ? {border: 'none', paddingBottom: 0, marginBottom: 0} : {}}>
                          <h6 className="fw-bold text-dark mb-1" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {prayer.request}
                          </h6>
                          <p className="text-muted small mb-0">
                            By {prayer.author || "Anonymous"} • {new Date(prayer.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>🙏</div>
                      <p className="text-muted mb-0">No recent prayer requests</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer bg-transparent border-0">
                <Link href="/prayer" className="btn btn-outline-success btn-sm rounded-pill px-4">
                  View Prayer Wall →
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Scriptures Card */}
          <div className="col-lg-4 mb-4">
            <div className="card h-100 border-0 shadow-sm home-card" style={{
              borderRadius: '12px'
            }}>
              <div className="card-header bg-transparent border-0 pt-4 pb-0">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                    <span style={{ fontSize: '1.5rem' }}>📖</span>
                  </div>
                  <h5 className="card-title mb-0 fw-bold">Recent Scriptures</h5>
                </div>
              </div>
              <div className="card-body pt-0">
                <div className="content-area" style={{ minHeight: '200px' }}>
                  {recentScriptures.length > 0 ? (
                    <div className="space-y-3">
                      {recentScriptures.map((scripture, index) => (
                        <div key={scripture.id} className="border-bottom pb-3 mb-3" style={index === recentScriptures.length - 1 ? {border: 'none', paddingBottom: 0, marginBottom: 0} : {}}>
                          <Link
                            href={`/scripture/${scripture.id}`}
                            className="text-decoration-none"
                          >
                            <h6 className="fw-bold text-dark mb-1">{scripture.reference}</h6>
                            <p className="text-muted small mb-0">
                              By {scripture.author} • {new Date(scripture.date).toLocaleDateString()}
                            </p>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-muted mb-2" style={{ fontSize: '2rem' }}>📖</div>
                      <p className="text-muted mb-0">No recent scripture shares</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer bg-transparent border-0">
                <Link href="/scripture" className="btn btn-outline-warning btn-sm rounded-pill px-4">
                  View Scripture Feed →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Community Call-to-Action Section */}
        <div className="cta-section mt-5 pt-5">
          <div className="text-center">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="p-4 rounded-3" style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  border: '1px solid #dee2e6'
                }}>
                  <h3 className="fw-bold mb-3" style={{ color: '#495057' }}>
                    Join Our Growing Community
                  </h3>
                  <p className="text-muted fs-5 mb-4">
                    Connect with fellow believers, share your journey, and grow together in faith.
                    Whether you're looking to join us for worship, need prayer support, or want to share encouragement, 
                    you'll find a welcoming home here.
                  </p>
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                    <Link href="/scripture" className="btn btn-primary btn-lg" style={{
                      borderRadius: '25px',
                      padding: '0.75rem 2rem',
                      fontWeight: '600'
                    }}>
                      📖 Share Scripture
                    </Link>
                    <Link href="/appreciation" className="btn btn-outline-primary btn-lg" style={{
                      borderRadius: '25px',
                      padding: '0.75rem 2rem',
                      fontWeight: '600'
                    }}>
                      💙 Appreciation Wall
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
