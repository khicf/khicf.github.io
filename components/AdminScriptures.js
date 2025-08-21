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
    <div>
      {message && <div className="alert alert-info">{message}</div>}

      

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
