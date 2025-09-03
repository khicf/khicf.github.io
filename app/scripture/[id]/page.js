import Link from "next/link";
import { notFound } from "next/navigation";

async function getScripture(id) {
  try {
    const res = await fetch(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/api/scriptures/${id}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function ScripturePage({ params }) {
  const { id } = await params;
  const scripture = await getScripture(id);

  if (!scripture) {
    return notFound();
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/scripture" className="text-decoration-none">
                  Scripture Feed
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {scripture.reference}
              </li>
            </ol>
          </nav>

          <article className="scripture-detail">
            <header className="mb-4">
              <h1 className="display-5 mb-3">{scripture.reference}</h1>
              <p className="text-muted">
                Shared by {scripture.author} on{" "}
                {new Date(scripture.date).toLocaleDateString()}
              </p>
            </header>

            <blockquote
              className="blockquote fs-6 lh-base text-dark mb-4"
              style={{ fontSize: "1.1rem" }}
            >
              "{scripture.passage}"
            </blockquote>

            <footer className="mt-5">
              <Link
                href="/scripture"
                className="btn btn-outline-primary"
                aria-label="Back to Scripture Feed"
              >
                ← Back to Scripture Feed
              </Link>
            </footer>
          </article>
        </div>
      </div>
    </main>
  );
}
