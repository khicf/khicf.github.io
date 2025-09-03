
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AppreciationWallPageClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appreciations, setAppreciations] = useState([]);
  const [filteredAppreciations, setFilteredAppreciations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [postMessage, setPostMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated') {
      fetchAppreciations();
    }
  }, [session, status, router]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = appreciations.filter(appreciation =>
      appreciation.message.toLowerCase().includes(lowerCaseSearchTerm) ||
      appreciation.user.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredAppreciations(results);
  }, [searchTerm, appreciations]);

  const fetchAppreciations = async () => {
    try {
      const res = await fetch('/api/appreciations');
      if (!res.ok) throw new Error('Failed to fetch appreciations');
      const data = await res.json();
      setAppreciations(data.appreciations);
      setFilteredAppreciations(data.appreciations);
    } catch (err) {
      setPostMessage(`Error fetching appreciations: ${err.message}`);
    }
  };

  const handlePostMessage = async (e) => {
    e.preventDefault();
    if (!message) {
      setPostMessage('Please enter a message.');
      return;
    }

    try {
      const res = await fetch('/api/appreciations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to post message');
      }
      
      setPostMessage(data.message);
      setMessage('');
      fetchAppreciations();
    } catch (err) {
      setPostMessage(`Error posting message: ${err.message}`);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="container py-4">
        {/* Page Hero Section */}
        <header className="page-hero row align-items-center justify-content-between mb-4 pb-3 border-bottom border-light">
          <div className="col-md-8">
            <h1 className="display-6 mb-2 fw-bold">Appreciation Wall</h1>
            <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
              Share gratitude and celebrate our community members
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <Link
              href="/appreciation/new"
              className="btn btn-primary"
              style={{ fontSize: '0.95rem', padding: '0.5rem 1.25rem' }}
            >
              Post an Appreciation
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
                placeholder="Search appreciations..."
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

        <div className="col-md-12">
          <h2 className="mb-4">Recent Appreciations</h2>
          {filteredAppreciations.length > 0 ? (
            filteredAppreciations.map((appreciation) => (
              <div key={appreciation.id} className="card mb-3">
                <div className="card-body">
                  <p className="card-text">{appreciation.message}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">From: {appreciation.user.name}</small>
                    <small className="text-muted">{new Date(appreciation.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state text-center py-5">
              <div className="mb-4">
                <span className="display-1 text-muted">💙</span>
              </div>
              <h3 className="text-muted mb-3">No appreciations found</h3>
              <p className="text-muted mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Be the first to share gratitude with the community!"}
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </button>
                )}
                <Link href="/appreciation/new" className="btn btn-primary">
                  Post an Appreciation
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
