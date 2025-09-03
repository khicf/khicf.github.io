
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
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>Appreciation Wall</h1>
          <Link href="/appreciation/new" className="btn btn-primary">Post an Appreciation</Link>
        </div>
        <div className="col-md-12">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search appreciations..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <h2>Recent Appreciations</h2>
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
            <p>No appreciations found.</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}
