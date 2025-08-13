export default function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container text-center">
        <span className="text-muted">© {new Date().getFullYear()} ICF Community. All rights reserved.</span>
      </div>
    </footer>
  );
}
