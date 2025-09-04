'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function PrayerPageClient() {
  const { data: session } = useSession();
  const [allPrayers, setAllPrayers] = useState([]);
  const [filteredPrayers, setFilteredPrayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [request, setRequest] = useState('');
  const [author, setAuthor] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  const fetchPrayers = () => {
    const url = session ? '/api/prayers' : '/api/prayers?public=true';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setAllPrayers(data.prayers.reverse());
        setFilteredPrayers(data.prayers.reverse());
      });
  };

  useEffect(() => {
    fetchPrayers();
  }, [session]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = allPrayers.filter(prayer =>
      prayer.request.toLowerCase().includes(lowerCaseSearchTerm) ||
      (prayer.author && prayer.author.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (prayer.comments && prayer.comments.some(comment =>
        comment.text.toLowerCase().includes(lowerCaseSearchTerm) ||
        (comment.author && comment.author.toLowerCase().includes(lowerCaseSearchTerm))
      ))
    );
    setFilteredPrayers(results);
  }, [searchTerm, allPrayers]);

  const handlePrayerSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/prayers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request, author, isPublic }),
    });
    if (res.ok) {
      fetchPrayers();
      setRequest('');
      setAuthor('');
      setIsPublic(true);
    }
  };

  const handleCommentSubmit = async (prayerId) => {
    if (!commentText.trim()) return;

    const res = await fetch(`/api/prayers/${prayerId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: commentText, author: commentAuthor || 'Anonymous' }),
    });
    if (res.ok) {
      fetchPrayers();
      setCommentText('');
      setCommentAuthor('');
    }
  };

  return (
    <div className="container py-4">
      {/* Page Hero Section */}
      <header className="page-hero row align-items-center justify-content-between mb-4 pb-3 border-bottom border-light">
        <div className="col-md-8">
          <h1 className="display-6 mb-2 fw-bold">Prayer Wall</h1>
          <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
            Share your requests and encourage one another in prayer
          </p>
        </div>
        <div className="col-md-4 text-md-end mt-3 mt-md-0">
          {session && (
            <Link
              href="/prayer/new"
              className="btn btn-primary"
              style={{ fontSize: '0.95rem', padding: '0.5rem 1.25rem' }}
            >
              Submit Prayer Request
            </Link>
          )}
        </div>
      </header>

      {/* Controls Bar */}
      <div className="controls-bar row g-3 align-items-center mb-4">
        <div className="col-md-8">
          <div className="position-relative">
            <input
              type="text"
              className="form-control pe-5"
              placeholder="Search prayers..."
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

      {/* Prayer Cards */}
      <div className="row">
        <div className="col-md-12">
          {filteredPrayers.length > 0 ? (
            filteredPrayers.map(prayer => (
              <article key={prayer.id} className={`prayer-card card mb-4 border-0 shadow-sm ${!prayer.isPublic ? 'private-prayer' : ''}`} style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                  {/* Prayer Header */}
                  <div className="prayer-header mb-3 d-flex align-items-start justify-content-between">
                    <div className="prayer-meta d-flex align-items-center">
                      <div className="author-avatar me-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                          <span className="fw-bold text-primary" style={{ fontSize: '1.2rem' }}>
                            {(prayer.author || 'Anonymous').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">{prayer.author || 'Anonymous'}</div>
                        <div className="text-muted small">
                          <time dateTime={prayer.date}>
                            {new Date(prayer.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </time>
                        </div>
                      </div>
                    </div>
                    {!prayer.isPublic && (
                      <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2" style={{ borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' }}>
                        Private
                      </span>
                    )}
                  </div>

                  {/* Prayer Content */}
                  <div className="prayer-content mb-4">
                    <blockquote className="mb-0">
                      <p className="fs-5 lh-base text-dark mb-0" style={{ fontStyle: 'italic' }}>
                        "{prayer.request}"
                      </p>
                    </blockquote>
                  </div>

                  {/* Comments Section */}
                  <div className="comments-section">
                    <div className="comments-header d-flex align-items-center justify-content-between mb-3">
                      <h6 className="mb-0 fw-bold text-muted d-flex align-items-center">
                        Comments
                        {prayer.comments && prayer.comments.length > 0 && (
                          <span className="badge bg-primary text-white ms-2" style={{ fontSize: '0.7rem' }}>{prayer.comments.length}</span>
                        )}
                      </h6>
                    </div>
                    {prayer.comments && prayer.comments.length > 0 ? (
                      <div className="comments-list">
                        {prayer.comments.map(comment => (
                          <div key={comment.id} className="comment-item d-flex mb-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                            <div className="comment-avatar flex-shrink-0 me-3">
                              <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                                <span className="fw-bold text-primary" style={{ fontSize: '0.9rem' }}>
                                  {comment.author.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="comment-content flex-grow-1">
                              <div className="comment-header d-flex align-items-center justify-content-between mb-2">
                                <span className="fw-semibold text-dark">{comment.author}</span>
                                <time className="text-muted small" dateTime={comment.date}>
                                  {new Date(comment.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </time>
                              </div>
                              <div className="comment-text text-dark">
                                {comment.text}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-comments text-center py-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                        <p className="text-muted mb-0">No comments yet. Be the first to share encouragement!</p>
                      </div>
                    )}

                    {session && (
                      <div className="add-comment-section mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                        <h6 className="fw-bold text-primary mb-3">Add Comment</h6>
                        <div className="mb-3">
                          <textarea
                            className="form-control border-0"
                            rows="3"
                            placeholder="Share words of encouragement, support, or let them know you're praying for them..."
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            style={{ 
                              backgroundColor: 'white', 
                              borderRadius: '8px',
                              fontSize: '0.95rem',
                              resize: 'none'
                            }}
                          />
                        </div>
                        <div className="row g-2 align-items-end">
                          <div className="col-md-8">
                            <input
                              type="text"
                              className="form-control border-0"
                              placeholder="Your name (optional)"
                              value={commentAuthor}
                              onChange={e => setCommentAuthor(e.target.value)}
                              style={{ 
                                backgroundColor: 'white', 
                                borderRadius: '8px',
                                fontSize: '0.9rem'
                              }}
                            />
                          </div>
                          <div className="col-md-4">
                            <button
                              className="btn btn-primary w-100"
                              onClick={() => handleCommentSubmit(prayer.id)}
                              disabled={!commentText.trim()}
                              style={{ borderRadius: '8px', fontWeight: '500' }}
                            >
                              Post Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state text-center py-5">
              <h3 className="text-muted mb-3">No prayer requests found</h3>
              <p className="text-muted mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Be the first to share a prayer request with the community!"}
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
                {session && (
                  <Link href="/prayer/new" className="btn btn-primary">
                    Submit Prayer Request
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}