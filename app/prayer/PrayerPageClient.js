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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Prayer Wall</h1>
        {session && (
          <Link href="/prayer/new" className="btn btn-primary">Submit a Prayer Request</Link>
        )}
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search prayers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredPrayers.length > 0 ? (
            filteredPrayers.map(prayer => (
              <div key={prayer.id} className={`card mb-3 ${!prayer.isPublic ? 'border-secondary' : ''}`}>
                <div className="card-body">
                  <p className="card-text fs-5">{prayer.request}</p>
                  <footer className="blockquote-footer">{prayer.author || 'Anonymous'} on <cite title="Source Title">{new Date(prayer.date).toLocaleDateString()}</cite></footer>
                  {!prayer.isPublic && <span className="badge bg-secondary">Private</span>}

                  <div className="mt-4">
                    <h5>Comments</h5>
                    {prayer.comments && prayer.comments.length > 0 ? (
                      prayer.comments.map(comment => (
                        <div key={comment.id} className="d-flex mb-3">
                          <div className="flex-shrink-0">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                              <span className="fw-bold">{comment.author.charAt(0)}</span>
                            </div>
                          </div>
                          <div className="ms-3">
                            <div className="fw-bold">{comment.author}</div>
                            {comment.text}
                            <div className="text-muted fs-sm">{new Date(comment.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No comments yet. Be the first to encourage!</p>
                    )}

                    {session && (
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
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No prayer requests found matching your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}