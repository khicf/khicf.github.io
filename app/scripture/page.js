"use client";


import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import Pagination from "@/components/Pagination";

export default function ScripturePage() {
  const [allScriptures, setAllScriptures] = useState([]);
  const [filteredScriptures, setFilteredScriptures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const searchInputRef = useRef(null);

  const books = [...new Set(allScriptures.map((s) => s.reference.split(" ")[0]))];
  const authors = [...new Set(allScriptures.map((s) => s.author))];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredScriptures.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const savedViewMode = localStorage.getItem("scriptureViewMode");
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("scriptureViewMode", viewMode);
  }, [viewMode]);

  const fetchScriptures = () => {
    fetch("/api/scriptures")
      .then((res) => res.json())
      .then((data) => {
        const reversed = data.scriptures.reverse();
        setAllScriptures(reversed);
        setFilteredScriptures(reversed);
      });
  };

  useEffect(() => {
    fetchScriptures();
  }, []);

  useEffect(() => {
    let results = allScriptures;

    // Apply filters
    if (selectedBook) {
      results = results.filter((s) => s.reference.startsWith(selectedBook));
    }

    if (selectedAuthor) {
      results = results.filter((s) => s.author === selectedAuthor);
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      results = results.filter(
        (scripture) =>
          scripture.passage.toLowerCase().includes(lowerCaseSearchTerm) ||
          scripture.reference.toLowerCase().includes(lowerCaseSearchTerm) ||
          scripture.author.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Apply sorting
    results = [...results].sort((a, b) => {
      switch (sortOrder) {
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "longest":
          return (b.passage?.length || 0) - (a.passage?.length || 0);
        case "newest":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    setFilteredScriptures(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, allScriptures, selectedBook, selectedAuthor, sortOrder]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Focus search input when '/' key is pressed
      if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        // Only if not already focused on an input/textarea
        if (document.activeElement?.tagName !== 'INPUT' && 
            document.activeElement?.tagName !== 'TEXTAREA') {
          event.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const getHighlightedText = (text, highlight) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  const getCardSize = (text, reference) => {
    if (!text) return "short";
    
    const words = text.trim().split(/\s+/).length;
    const chars = text.length;
    
    // Check if this looks like a Bible verse reference
    const isBibleVerse = reference && /\d+:\d+/.test(reference);
    
    // For Bible verses, be more conservative about marking as "short"
    // Only use "short" for very brief passages that are clearly meant to be highlighted
    if (isBibleVerse) {
      // For Bible verses, only mark as short if it's extremely brief (like a single sentence)
      if (words <= 5 && chars <= 40) return "short";
      // Most Bible verses should be medium to maintain proper formatting
      if (words <= 40 || chars <= 300) return "medium";
      // Long passages get the fade effect
      if (chars > 400 || words > 50) return "long";
      return "medium";
    } else {
      // Non-Bible content (quotes, etc.) can use the original logic
      if (words <= 8 || chars <= 60) return "short";
      if (words <= 30 || chars <= 250) return "medium";
      if (chars > 400 || words > 50) return "long";
      return "medium";
    }
  };


  return (
    <div className="scripture-page container py-4">
      {/* Page Hero Section */}
      <header className="page-hero row align-items-center justify-content-between mb-4 pb-3 border-bottom border-light">
        <div className="col-md-8">
          <h1 className="display-6 mb-2 fw-bold">Scripture Feed</h1>
          <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>
            A place to share verses & encourage one another
          </p>
        </div>
        <div className="col-md-4 text-md-end mt-3 mt-md-0">
          <Link
            href="/scripture/new"
            className="btn btn-primary"
            aria-label="Share a scripture"
            style={{ fontSize: '0.95rem', padding: '0.5rem 1.25rem' }}
          >
            Share a Scripture
          </Link>
        </div>
      </header>

      {/* Controls Bar */}
      <div className="controls-bar row g-3 align-items-center mb-4">
        <div className="col-md-6">
          <div className="position-relative">
            <input
              ref={searchInputRef}
              type="text"
              className="form-control pe-5"
              placeholder="Search scriptures... (Press / to focus)"
              aria-label="Search scriptures"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchTerm('');
                  e.target.blur();
                }
              }}
              style={{ fontSize: '0.95rem', padding: '0.65rem 1rem' }}
            />
            {searchTerm && (
              <button
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                style={{ zIndex: 5 }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-md-end gap-2">
            <div className="btn-group" role="group" aria-label="View mode">
              <button
                className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
              >
                Grid
              </button>
              <button
                className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setViewMode("list")}
                aria-pressed={viewMode === "list"}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Filters Section */}
      <div className="filters-section row g-2 mb-4">
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            aria-label="Filter by book"
            style={{ fontSize: '0.9rem' }}
          >
            <option value="">All Books</option>
            {books.map((book) => (
              <option key={book} value={book}>
                {book}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            aria-label="Filter by author"
            style={{ fontSize: '0.9rem' }}
          >
            <option value="">All Authors</option>
            {authors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            aria-label="Sort scriptures"
            style={{ fontSize: '0.9rem' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="longest">Longest First</option>
          </select>
        </div>
      </div>

      <div className={viewMode === "grid" ? "scripture-grid" : "scripture-list"} role="list">
        {currentItems.length > 0 ? (
          currentItems.map((scripture) => {
            const size = getCardSize(scripture.passage || "", scripture.reference || "");
            return (
              <article
                key={scripture.id}
                className={`card scripture-card card--${size}`}
                aria-labelledby={`ref-${scripture.id}`}
              >
                <div className="card-body">
                  <div className="passage-wrap">
                    <span className="decor-quote" aria-hidden="true">"</span>
                    <p className="scripture-passage">{getHighlightedText(scripture.passage, searchTerm)}</p>
                  </div>

                  <footer className="card-footer">
                    <div>
                      <div className="reference">— {getHighlightedText(scripture.reference, searchTerm)}</div>
                      <div className="meta">Shared by {getHighlightedText(scripture.author, searchTerm)} on {new Date(scripture.date + 'T00:00:00').toLocaleDateString('en-US', {
                        timeZone: 'America/Chicago'
                      })}</div>
                    </div>
                    <Link href={`/scripture/${scripture.id}`} className="read-link">Read</Link>
                  </footer>
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty-state text-center py-5">
            <h3 className="text-muted mb-3">No scriptures found</h3>
            <p className="text-muted mb-4">
              {searchTerm || selectedBook || selectedAuthor
                ? "Try adjusting your search criteria or filters."
                : "Be the first to share an inspiring scripture verse!"}
            </p>
            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
              {(searchTerm || selectedBook || selectedAuthor || sortOrder !== "newest") && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedBook('');
                    setSelectedAuthor('');
                    setSortOrder('newest');
                  }}
                >
                  Clear Filters
                </button>
              )}
              <Link href="/scripture/new" className="btn btn-primary">
                Share a Scripture
              </Link>
            </div>
          </div>
        )}
      </div>
      
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredScriptures.length}
        paginate={paginate}
      />
    </div>
  );
}
