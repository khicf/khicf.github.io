'use client';

import { useState, useEffect } from 'react';

export default function ScripturePage() {
  const [allScriptures, setAllScriptures] = useState([]);
  const [filteredScriptures, setFilteredScriptures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [passage, setPassage] = useState('');
  const [reference, setReference] = useState('');
  const [author, setAuthor] = useState('');
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');

  const fetchScriptures = () => {
    fetch('/api/scriptures')
      .then(res => res.json())
      .then(data => {
        setAllScriptures(data.scriptures.reverse());
        setFilteredScriptures(data.scriptures.reverse());
      });
  };

  useEffect(() => {
    fetchScriptures();
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = allScriptures.filter(scripture =>
      scripture.passage.toLowerCase().includes(lowerCaseSearchTerm) ||
      scripture.reference.toLowerCase().includes(lowerCaseSearchTerm) ||
      scripture.author.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredScriptures(results);
  }, [searchTerm, allScriptures]);

  const handleFetchScripture = async () => {
    if (!book || !chapter || !verse) {
      alert('Please fill in book, chapter, and verse.');
      return;
    }
    const url = `https://bible-api.com/${book}+${chapter}:${verse}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setPassage(data.text);
        setReference(data.reference);
      }
    } catch (error) {
      alert('Error fetching scripture.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/scriptures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passage, reference, author }),
    });
    if (res.ok) {
      fetchScriptures();
      setPassage('');
      setReference('');
      setAuthor('');
      setBook('');
      setChapter('');
      setVerse('');
    }
  };

  return (
    <div>
      <h1>Scripture Feed</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search scriptures..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Share a Scripture</h5>
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label htmlFor="book" className="form-label">Book</label>
              <input type="text" className="form-control" id="book" value={book} onChange={e => setBook(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label htmlFor="chapter" className="form-label">Chapter</label>
              <input type="text" className="form-control" id="chapter" value={chapter} onChange={e => setChapter(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label htmlFor="verse" className="form-label">Verse</label>
              <input type="text" className="form-control" id="verse" value={verse} onChange={e => setVerse(e.target.value)} />
            </div>
          </div>
          <button type="button" className="btn btn-secondary mb-3" onClick={handleFetchScripture}>Fetch Scripture</button>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="passage" className="form-label">Passage</label>
              <textarea className="form-control" id="passage" rows="3" value={passage} onChange={e => setPassage(e.target.value)} required></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="reference" className="form-label">Reference</label>
              <input type="text" className="form-control" id="reference" value={reference} onChange={e => setReference(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="author" className="form-label">Your Name</label>
              <input type="text" className="form-control" id="author" value={author} onChange={e => setAuthor(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Share</button>
          </form>
        </div>
      </div>

      {filteredScriptures.length > 0 ? (
        filteredScriptures.map(scripture => (
          <div key={scripture.id} className="card mb-3">
            <div className="card-body">
              <blockquote className="blockquote mb-0">
                <p>{scripture.passage}</p>
                <footer className="blockquote-footer">{scripture.reference}</footer>
              </blockquote>
              <p className="text-muted mt-2 mb-0">Shared by {scripture.author} on {new Date(scripture.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted">No scriptures found matching your search.</p>
      )}
    </div>
  );
}
