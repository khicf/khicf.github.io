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
  const [commentTexts, setCommentTexts] = useState({});
  const [commentAuthors, setCommentAuthors] = useState({});
  const [editingPrayer, setEditingPrayer] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editPrayerText, setEditPrayerText] = useState('');
  const [editPrayerIsPublic, setEditPrayerIsPublic] = useState(true);
  const [editCommentText, setEditCommentText] = useState('');

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
    const commentText = commentTexts[prayerId] || '';
    const commentAuthor = commentAuthors[prayerId] || '';
    
    if (!commentText.trim()) return;

    const res = await fetch(`/api/prayers/${prayerId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: commentText, author: commentAuthor || 'Anonymous' }),
    });
    if (res.ok) {
      fetchPrayers();
      setCommentTexts(prev => ({ ...prev, [prayerId]: '' }));
      setCommentAuthors(prev => ({ ...prev, [prayerId]: '' }));
    }
  };

  const startEditingPrayer = (prayer) => {
    setEditingPrayer(prayer.id);
    setEditPrayerText(prayer.request);
    setEditPrayerIsPublic(prayer.isPublic);
  };

  const cancelEditingPrayer = () => {
    setEditingPrayer(null);
    setEditPrayerText('');
    setEditPrayerIsPublic(true);
  };

  const handlePrayerUpdate = async (prayerId) => {
    if (!editPrayerText.trim()) return;

    const res = await fetch(`/api/prayers/${prayerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        request: editPrayerText, 
        isPublic: editPrayerIsPublic 
      }),
    });
    
    if (res.ok) {
      fetchPrayers();
      setEditingPrayer(null);
      setEditPrayerText('');
      setEditPrayerIsPublic(true);
    }
  };

  const handlePrayerDelete = async (prayerId) => {
    if (!confirm('Are you sure you want to delete this prayer?')) return;

    try {
      const res = await fetch(`/api/prayers/${prayerId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchPrayers();
        console.log('Prayer deleted successfully');
      } else {
        const errorData = await res.json();
        console.error('Error deleting prayer:', errorData);
        alert(`Error deleting prayer: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network error deleting prayer:', error);
      alert('Network error deleting prayer');
    }
  };

  const startEditingComment = (comment) => {
    setEditingComment(comment.id);
    setEditCommentText(comment.text);
  };

  const cancelEditingComment = () => {
    setEditingComment(null);
    setEditCommentText('');
  };

  const handleCommentUpdate = async (commentId) => {
    if (!editCommentText.trim()) return;

    const res = await fetch(`/api/comments/${commentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editCommentText }),
    });
    
    if (res.ok) {
      fetchPrayers();
      setEditingComment(null);
      setEditCommentText('');
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    const res = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });
    
    if (res.ok) {
      fetchPrayers();
    }
  };

  const canEditContent = (content) => {
    if (!session || !session.user) {
      console.log('No session or user');
      return false;
    }
    
    console.log('Checking canEditContent:', {
      sessionUser: session.user,
      content: content,
      userRole: session.user.role
    });
    
    // Admins can edit any content
    if (session.user.role === 'ADMIN') {
      console.log('Admin user can edit');
      return true;
    }
    
    // Check if user owns the content by email (more reliable than ID matching)
    if (content.user && content.user.email === session.user.email) {
      console.log('User owns content by email');
      return true;
    }
    
    // Fallback: check by userId if available
    if (content.userId && session.user.id === content.userId) {
      console.log('User owns content by userId');
      return true;
    }
    
    // For legacy content without userId, check by author name
    if (!content.userId && content.author && content.author === session.user.name) {
      console.log('User owns content by author name');
      return true;
    }
    
    console.log('User cannot edit content');
    return false;
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
                            {new Date(prayer.date + 'T00:00:00').toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              timeZone: 'America/Chicago'
                            })}
                          </time>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      {!prayer.isPublic && (
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2" style={{ borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' }}>
                          Private
                        </span>
                      )}
                      {session && canEditContent(prayer) && (
                        <div className="dropdown">
                          <button className="btn btn-link text-muted p-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li><button className="dropdown-item" onClick={() => startEditingPrayer(prayer)}>Edit Prayer</button></li>
                            <li><button className="dropdown-item text-danger" onClick={() => handlePrayerDelete(prayer.id)}>Delete Prayer</button></li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prayer Content */}
                  <div className="prayer-content mb-4">
                    {editingPrayer === prayer.id ? (
                      <div className="edit-prayer-form">
                        <div className="mb-3">
                          <textarea
                            className="form-control"
                            rows="4"
                            value={editPrayerText}
                            onChange={e => setEditPrayerText(e.target.value)}
                            placeholder="Edit your prayer request..."
                            style={{ borderRadius: '8px' }}
                          />
                        </div>
                        <div className="mb-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`editPublic-${prayer.id}`}
                              checked={editPrayerIsPublic}
                              onChange={e => setEditPrayerIsPublic(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor={`editPublic-${prayer.id}`}>
                              Make this prayer public
                            </label>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handlePrayerUpdate(prayer.id)}
                            disabled={!editPrayerText.trim()}
                          >
                            Save Changes
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={cancelEditingPrayer}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <blockquote className="mb-0">
                        <p className="fs-5 lh-base text-dark mb-0" style={{ fontStyle: 'italic' }}>
                          "{prayer.request}"
                        </p>
                      </blockquote>
                    )}
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
                                <div className="d-flex align-items-center gap-2">
                                  <time className="text-muted small" dateTime={comment.date}>
                                    {new Date(comment.date + 'T00:00:00').toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric',
                                      timeZone: 'America/Chicago'
                                    })}
                                  </time>
                                  {session && canEditContent(comment) && (
                                    <div className="dropdown">
                                      <button className="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ fontSize: '12px' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                        </svg>
                                      </button>
                                      <ul className="dropdown-menu dropdown-menu-end">
                                        <li><button className="dropdown-item" onClick={() => startEditingComment(comment)}>Edit Comment</button></li>
                                        <li><button className="dropdown-item text-danger" onClick={() => handleCommentDelete(comment.id)}>Delete Comment</button></li>
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="comment-text text-dark">
                                {editingComment === comment.id ? (
                                  <div className="edit-comment-form">
                                    <div className="mb-2">
                                      <textarea
                                        className="form-control"
                                        rows="2"
                                        value={editCommentText}
                                        onChange={e => setEditCommentText(e.target.value)}
                                        placeholder="Edit your comment..."
                                        style={{ borderRadius: '6px', fontSize: '0.9rem' }}
                                      />
                                    </div>
                                    <div className="d-flex gap-1">
                                      <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleCommentUpdate(comment.id)}
                                        disabled={!editCommentText.trim()}
                                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                      >
                                        Save
                                      </button>
                                      <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={cancelEditingComment}
                                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  comment.text
                                )}
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
                            value={commentTexts[prayer.id] || ''}
                            onChange={e => setCommentTexts(prev => ({ ...prev, [prayer.id]: e.target.value }))}
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
                              value={commentAuthors[prayer.id] || ''}
                              onChange={e => setCommentAuthors(prev => ({ ...prev, [prayer.id]: e.target.value }))}
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
                              disabled={!(commentTexts[prayer.id] || '').trim()}
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