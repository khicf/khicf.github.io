'use client';

import { useState, useEffect } from 'react';

export default function PrayerPage() {
  const [allPrayers, setAllPrayers] = useState([]);
  const [filteredPrayers, setFilteredPrayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [request, setRequest] = useState('');
  const [author, setAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  const fetchPrayers = () => {
    fetch('/api/prayers')
      .then(res => res.json())
      .then(data => {
        setAllPrayers(data.prayers.reverse());
        setFilteredPrayers(data.prayers.reverse());
      });
  };

  useEffect(() => {
    fetchPrayers();
  }, []);

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
      body: JSON.stringify({ request, author }),
    });
    if (res.ok) {
      fetchPrayers();
      setRequest('');
      setAuthor('');
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
    <div>
      <h1>Prayer Wall</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search prayers..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Submit a Prayer Request</h5>
          <form onSubmit={handlePrayerSubmit}>
            <div className="mb-3">
              <label htmlFor="request" className="form-label">Request</label>
              <textarea className="form-control" id="request" rows="3" value={request} onChange={e => setRequest(e.target.value)} required></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="author" className="form-label">Your Name (Optional)</label>
              <input type="text" className="form-control" id="author" value={author} onChange={e => setAuthor(e.target.value)} placeholder="A Friend" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      {filteredPrayers.length > 0 ? (
        filteredPrayers.map(prayer => (
          <div key={prayer.id} className="card mb-3">
            <div className="card-body">
              <p className="card-text">{prayer.request}</p>
              <footer className="blockquote-footer">{prayer.author || 'Anonymous'} on <cite title="Source Title">{new Date(prayer.date).toLocaleDateString()}</cite></footer>

              <div className="mt-3">
                <h6>Comments:</h6>
                {prayer.comments && prayer.comments.length > 0 ? (
                  prayer.comments.map(comment => (
                    <div key={comment.id} className="card card-body bg-light mb-2">
                      <p className="mb-0">{comment.text}</p>
                      <small className="text-muted">By {comment.author} on {new Date(comment.date).toLocaleDateString()}</small>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No comments yet. Be the first to encourage!</p>
                )}

                <div className="mt-3">
                  <textarea
                    className="form-control mb-2"
                    rows="2"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                  ></textarea>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Your Name (Optional)"
                    value={commentAuthor}
                    onChange={e => setCommentAuthor(e.target.value)}
                  />
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleCommentSubmit(prayer.id)}
                  >Add Comment</button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted">No prayer requests found matching your search.</p>
      )}
    </div>
  );
}