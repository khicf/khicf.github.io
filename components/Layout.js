import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container mt-4 flex-grow-1 main-content-fade-in">{children}</main>
      <Footer />
    </div>
  );
}
