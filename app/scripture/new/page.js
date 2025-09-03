'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewScripturePage() {
  const router = useRouter();
  const [passage, setPassage] = useState('');
  const [reference, setReference] = useState('');
  const [author, setAuthor] = useState('');
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');

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
      router.push('/scripture');
    }
  };

  return (
    <div>
      <h1>Share a Scripture</h1>
      <div className="card">
        <div className="card-body">
          <div className="row g-3 align-items-center mb-3">
            <div className="col">
              <input type="text" className="form-control" placeholder="Book" value={book} onChange={e => setBook(e.target.value)} />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="Chapter" value={chapter} onChange={e => setChapter(e.target.value)} />
            </div>
            <div className="col">
              <input type="text" className="form-control" placeholder="Verse" value={verse} onChange={e => setVerse(e.target.value)} />
            </div>
            <div className="col-auto">
              <button type="button" className="btn btn-secondary" onClick={handleFetchScripture}>Fetch</button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <textarea className="form-control" rows="3" placeholder="Passage" value={passage} onChange={e => setPassage(e.target.value)} required></textarea>
            </div>
            <div className="mb-3">
              <input type="text" className="form-control" placeholder="Reference" value={reference} onChange={e => setReference(e.target.value)} required />
            </div>
            <div className="mb-3">
              <input type="text" className="form-control" placeholder="Your Name" value={author} onChange={e => setAuthor(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Share</button>
          </form>
        </div>
      </div>

      {passage && (
        <div className="mt-4">
          <h2>Preview</h2>
          <div className="card">
            <div className="card-body">
              <blockquote className="blockquote mb-0">
                <p>{passage}</p>
                <footer className="blockquote-footer">{reference}</footer>
              </blockquote>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
