'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAppreciationPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [postMessage, setPostMessage] = useState('');

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
      
      router.push('/appreciation');
    } catch (err) {
      setPostMessage(`Error posting message: ${err.message}`);
    }
  };

  return (
    <div>
      <h1>Post an Appreciation</h1>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handlePostMessage}>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share something you appreciate..."
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Post</button>
          </form>
          {postMessage && <div className="alert alert-info mt-3">{postMessage}</div>}
        </div>
      </div>

      <div className="mt-4">
        <h2>Preview</h2>
        <div className="card mb-3">
          <div className="card-body">
            <p className="card-text">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
