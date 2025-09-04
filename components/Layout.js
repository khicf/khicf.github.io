import Navbar from './Navbar';
import Footer from './Footer';
import BootstrapClient from './BootstrapClient';

export default function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <BootstrapClient />
      <Navbar />
      <main className="container mt-4 flex-grow-1 main-content-fade-in">{children}</main>
      <Footer />
    </div>
  );
}
