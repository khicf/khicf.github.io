'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">ICF Community</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/events" className="nav-link">Events</Link>
            </li>
            <li className="nav-item">
              <Link href="/prayer" className="nav-link">Prayer Wall</Link>
            </li>
            <li className="nav-item">
              <Link href="/scripture" className="nav-link">Scripture Feed</Link>
            </li>
            {session && (
              <li className="nav-item">
                <Link href="/appreciation" className="nav-link">Appreciation Wall</Link>
              </li>
            )}
            
            {session?.user?.role && ['ADMIN', 'CORE'].includes(session.user.role) && (
              <li className="nav-item">
                <Link href="/admin" className="nav-link">Admin Panel</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav">
            {session ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Welcome, {session.user.name}</span>
                </li>
                <li className="nav-item">
                  <Link href="/profile" className="nav-link">Profile</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={() => signOut()}>Logout</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => signIn()}>Login</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}