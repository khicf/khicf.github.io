'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminEvents from '@/components/AdminEvents';
import AdminPrayers from '@/components/AdminPrayers';
import AdminScriptures from '@/components/AdminScriptures';

export default function AdminPageClient() {
  const [activeTab, setActiveTab] = useState('events');

  return (
    <div>
      <h1>Admin Panel</h1>

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
        <li className="nav-item">
          <Link href="/admin/users" className="nav-link">Users</Link>
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