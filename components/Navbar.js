import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">ICF Community</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
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
          </ul>
        </div>
      </div>
    </nav>
  );
}
