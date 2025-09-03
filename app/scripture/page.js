"use client";

import TruncatedText from "@/components/TruncatedText";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ScripturePage() {
  const [allScriptures, setAllScriptures] = useState([]);
  const [filteredScriptures, setFilteredScriptures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [passage, setPassage] = useState("");
  const [reference, setReference] = useState("");
  const [author, setAuthor] = useState("");
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");

  const fetchScriptures = () => {
    fetch("/api/scriptures")
      .then((res) => res.json())
      .then((data) => {
        setAllScriptures(data.scriptures.reverse());
        setFilteredScriptures(data.scriptures.reverse());
      });
  };

  useEffect(() => {
    fetchScriptures();
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = allScriptures.filter(
      (scripture) =>
        scripture.passage.toLowerCase().includes(lowerCaseSearchTerm) ||
        scripture.reference.toLowerCase().includes(lowerCaseSearchTerm) ||
        scripture.author.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredScriptures(results);
  }, [searchTerm, allScriptures]);

  const handleFetchScripture = async () => {
    if (!book || !chapter || !verse) {
      alert("Please fill in book, chapter, and verse.");
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
      alert("Error fetching scripture.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/scriptures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passage, reference, author }),
    });
    if (res.ok) {
      fetchScriptures();
      setPassage("");
      setReference("");
      setAuthor("");
      setBook("");
      setChapter("");
      setVerse("");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Scripture Feed</h1>
        <Link href="/scripture/new" className="btn btn-primary">
          Share a Scripture
        </Link>
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search scriptures..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="row">
        {filteredScriptures.length > 0 ? (
          filteredScriptures.map((scripture) => (
            <div key={scripture.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <blockquote className="blockquote mb-0">
                    <p>
                      <TruncatedText text={scripture.passage} maxLength={150} />
                    </p>
                    <footer className="blockquote-footer">
                      {scripture.reference}
                    </footer>
                  </blockquote>
                  <p className="text-muted mt-2 mb-0">
                    Shared by {scripture.author} on{" "}
                    {new Date(scripture.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">
            No scriptures found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
