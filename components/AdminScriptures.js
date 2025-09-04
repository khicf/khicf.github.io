'use client';

import { useState, useEffect } from 'react';

export default function AdminScriptures() {
  const [scriptures, setScriptures] = useState([]);
  const [editingScripture, setEditingScripture] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchScriptures();
  }, []);

  const fetchScriptures = async () => {
    try {
      const res = await fetch('/api/scriptures');
      if (!res.ok) throw new Error('Failed to fetch scriptures');
      const data = await res.json();
      setScriptures(data.scriptures);
    } catch (err) {
      setMessage(`Error fetching scriptures: ${err.message}`);
    }
  };

  

  const handleEditClick = (scripture) => {
    setEditingScripture({ ...scripture });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingScripture({ ...editingScripture, [name]: value });
  };

  const handleUpdateScripture = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/scriptures', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingScripture),
      });
      if (!res.ok) throw new Error('Failed to update scripture');
      setMessage('Scripture updated successfully!');
      setEditingScripture(null);
      fetchScriptures();
    } catch (err) {
      setMessage(`Error updating scripture: ${err.message}`);
    }
  };

  const handleDeleteScripture = async (id) => {
    if (confirm('Are you sure you want to delete this scripture?')) {
      try {
        const res = await fetch('/api/admin/scriptures', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error('Failed to delete scripture');
        setMessage('Scripture deleted successfully!');
        fetchScriptures();
      } catch (err) {
        setMessage(`Error deleting scripture: ${err.message}`);
      }
    }
  };

  return (
    <div className="admin-scriptures">
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`} role="alert">
          <strong>{message.includes('Error') ? '❌ Error:' : '✅ Success:'}</strong> {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {/* Scriptures List */}
      <div className="scriptures-list">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0 fw-bold d-flex align-items-center">
            Scriptures
            {scriptures.length > 0 && (
              <span className="badge bg-primary ms-2">{scriptures.length}</span>
            )}
          </h2>
        </div>

        {scriptures.length > 0 ? (
          <div className="row g-3">
            {scriptures.map(scripture => (
              <div key={scripture.id} className="col-lg-6 col-xl-4">
                <div className="scripture-admin-card card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-4">
                    <div className="scripture-header mb-3">
                      <div className="d-flex align-items-start justify-content-between">
                        <div className="flex-grow-1">
                          <h5 className="fw-bold text-dark mb-1">{scripture.reference}</h5>
                          <div className="scripture-meta text-muted small mb-2">
                            <div className="d-flex align-items-center mb-1">
                              <span>By {scripture.author}</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span>{new Date(scripture.date + 'T00:00:00').toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                timeZone: 'America/Chicago'
                              })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="scripture-content mb-3">
                      <p className="text-dark mb-0" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.5',
                        fontStyle: 'italic'
                      }}>
                        "{scripture.passage}"
                      </p>
                    </div>

                    <div className="scripture-actions d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm flex-fill"
                        onClick={() => handleEditClick(scripture)}
                        style={{ borderRadius: '6px' }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm flex-fill"
                        onClick={() => handleDeleteScripture(scripture.id)}
                        style={{ borderRadius: '6px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state text-center py-5">
            <div className="mb-4">
            </div>
            <h4 className="text-muted mb-3">No scriptures found</h4>
            <p className="text-muted">Daily scriptures will appear here once they are shared by community members.</p>
          </div>
        )}
      </div>

      {/* Edit Scripture Modal */}
      {editingScripture && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Scripture</h5>
                <button type="button" className="btn-close" onClick={() => setEditingScripture(null)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="editPassage" className="form-label">Passage</label>
                    <textarea className="form-control" id="editPassage" name="passage" rows="3" value={editingScripture.passage} onChange={handleEditInputChange} required></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editReference" className="form-label">Reference</label>
                    <input type="text" className="form-control" id="editReference" name="reference" value={editingScripture.reference} onChange={handleEditInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editAuthor" className="form-label">Author</label>
                    <input type="text" className="form-control" id="editAuthor" name="author" value={editingScripture.author} onChange={handleEditInputChange} required />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingScripture(null)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateScripture}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
