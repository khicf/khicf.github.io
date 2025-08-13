'use client';

import { useState, useEffect } from 'react';

export default function AdminScriptures() {
  const [scriptures, setScriptures] = useState([]);
  const [newScripture, setNewScripture] = useState({
    passage: '',
    reference: '',
    author: '',
  });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewScripture({ ...newScripture, [name]: value });
  };

  const handleAddScripture = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/scriptures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newScripture),
      });
      if (!res.ok) throw new Error('Failed to add scripture');
      setMessage('Scripture added successfully!');
      setNewScripture({ passage: '', reference: '', author: '' });
      fetchScriptures();
    } catch (err) {
      setMessage(`Error adding scripture: ${err.message}`);
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
    <div>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Scripture</h5>
          <form onSubmit={handleAddScripture}>
            <div className="mb-3">
              <label htmlFor="passage" className="form-label">Passage</label>
              <textarea className="form-control" id="passage" name="passage" rows="3" value={newScripture.passage} onChange={handleInputChange} required></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="reference" className="form-label">Reference</label>
              <input type="text" className="form-control" id="reference" name="reference" value={newScripture.reference} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="author" className="form-label">Author</label>
              <input type="text" className="form-control" id="author" name="author" value={newScripture.author} onChange={handleInputChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Add Scripture</button>
          </form>
        </div>
      </div>

      <h2>Existing Scriptures</h2>
      <div className="list-group mb-4">
        {scriptures.length > 0 ? (
          scriptures.map(scripture => (
            <div key={scripture.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{scripture.reference}</h5>
                <p>{scripture.passage}</p>
                <p><small>By {scripture.author} on {new Date(scripture.date).toLocaleDateString()}</small></p>
              </div>
              <div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(scripture)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteScripture(scripture.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No scriptures found.</p>
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
