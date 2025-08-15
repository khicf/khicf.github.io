'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import AdminEvents from '@/components/AdminEvents';
import AdminPrayers from '@/components/AdminPrayers';
import AdminScriptures from '@/components/AdminScriptures';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('events');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setMessage(result.error);
    } else {
      // Login successful, session will update
    }
  };

  if (status === 'loading') {
    return (
      <div className="container mt-5 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Admin Login</h5>
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Login</button>
                  {message && <p className="text-danger mt-2">{message}</p>}
                </form>
                <p className="mt-3 text-center">
                  Don't have an account? <Link href="/signup">Sign Up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      {message && <div className="alert alert-info">{message}</div>}

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'prayers' ? 'active' : ''}`}
            onClick={() => setActiveTab('prayers')}
          >
            Prayers
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'scriptures' ? 'active' : ''}`}
            onClick={() => setActiveTab('scriptures')}
          >
            Scriptures
          </button>
        </li>
      </ul>

      <div>
        {activeTab === 'events' && <AdminEvents />}
        {activeTab === 'prayers' && <AdminPrayers />}
        {activeTab === 'scriptures' && <AdminScriptures />}
      </div>
    </div>
  );
}
