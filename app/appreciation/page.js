'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AppreciationWallPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appreciations, setAppreciations] = useState([]);
  const [message, setMessage] = useState('');
  const [postMessage, setPostMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated') {
      fetchAppreciations();
    }
  }, [session, status, router]);

  const fetchAppreciations = async () => {
    try {
      const res = await fetch('/api/appreciations');
      if (!res.ok) throw new Error('Failed to fetch appreciations');
      const data = await res.json();
      setAppreciations(data.appreciations);
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
      <div>
        <h1>Appreciation Wall</h1>
        {postMessage && <div className="alert alert-info">{postMessage}</div>}

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Post an Appreciation</h5>
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
          </div>
        </div>

        <h2>Recent Appreciations</h2>
        <div className="list-group">
          {appreciations.length > 0 ? (
            appreciations.map((appreciation) => (
              <div key={appreciation.id} className="list-group-item list-group-item-action flex-column align-items-start">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{appreciation.user.name}</h5>
                  <small>{new Date(appreciation.createdAt).toLocaleDateString()}</small>
                </div>
                <p className="mb-1">{appreciation.message}</p>
              </div>
            ))
          ) : (
            <p>No appreciations found.</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}
