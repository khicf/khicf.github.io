"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ScriptureModal({ scriptureId, onClose }) {
  const [scripture, setScripture] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (scriptureId) {
      fetch(`/api/scriptures/${scriptureId}`)
        .then((res) => res.json())
        .then((data) => setScripture(data));
    }
  }, [scriptureId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (scriptureId) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus trap - focus the close button initially
      setTimeout(() => {
        const closeButton = document.querySelector('.modal-content .btn-close');
        closeButton?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [scriptureId]);

  const handleClose = () => {
    router.back();
    onClose();
  };

  if (!scripture) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 id="modal-title" className="modal-title">{scripture.reference}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleClose}
              aria-label="Close modal"
            ></button>
          </div>
          <div className="modal-body">
            <blockquote className="blockquote fs-5 lh-base mb-4">
              "{scripture.passage}"
            </blockquote>
            <p className="custom-text-muted small mb-0">
              Shared by {scripture.author} on{" "}
              {new Date(scripture.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
