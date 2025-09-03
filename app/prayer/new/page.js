'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPrayerPage() {
  const router = useRouter();
  const [request, setRequest] = useState('');
  const [author, setAuthor] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handlePrayerSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/prayers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request, author, isPublic }),
    });
    if (res.ok) {
      router.push('/prayer');
    }
  };

  return (
    <div>
      <h1>Submit a Prayer Request</h1>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handlePrayerSubmit}>
            <div className="mb-3">
              <label htmlFor="request" className="form-label">Request</label>
              <textarea className="form-control" id="request" rows="3" value={request} onChange={e => setRequest(e.target.value)} required></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="author" className="form-label">Your Name (Optional)</label>
              <input type="text" className="form-control" id="author" value={author} onChange={e => setAuthor(e.target.value)} placeholder="A Friend" />
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="isPublic">
                Make this prayer public
              </label>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <div className="mt-4">
        <h2>Preview</h2>
        <div className={`card mb-3 ${!isPublic ? 'border-secondary' : ''}`}>
          <div className="card-body">
            <p className="card-text fs-5">{request}</p>
            <footer className="blockquote-footer">{author || 'Anonymous'}</footer>
            {!isPublic && <span className="badge bg-secondary">Private</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
