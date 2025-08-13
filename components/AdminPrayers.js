'use client';

import { useState, useEffect } from 'react';

export default function AdminPrayers() {
  const [prayers, setPrayers] = useState([]);
  const [newPrayer, setNewPrayer] = useState({
    request: '',
    author: '',
  });
  const [editingPrayer, setEditingPrayer] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    try {
      const res = await fetch('/api/prayers');
      if (!res.ok) throw new Error('Failed to fetch prayers');
      const data = await res.json();
      setPrayers(data.prayers);
    } catch (err) {
      setMessage(`Error fetching prayers: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrayer({ ...newPrayer, [name]: value });
  };

  const handleAddPrayer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/prayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrayer),
      });
      if (!res.ok) throw new Error('Failed to add prayer');
      setMessage('Prayer added successfully!');
      setNewPrayer({ request: '', author: '' });
      fetchPrayers();
    } catch (err) {
      setMessage(`Error adding prayer: ${err.message}`);
    }
  };

  const handleEditClick = (prayer) => {
    setEditingPrayer({ ...prayer });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingPrayer({ ...editingPrayer, [name]: value });
  };

  const handleUpdatePrayer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/prayers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPrayer),
      });
      if (!res.ok) throw new Error('Failed to update prayer');
      setMessage('Prayer updated successfully!');
      setEditingPrayer(null);
      fetchPrayers();
    } catch (err) {
      setMessage(`Error updating prayer: ${err.message}`);
    }
  };

  const handleDeletePrayer = async (id) => {
    if (confirm('Are you sure you want to delete this prayer and all its comments?')) {
      try {
        const res = await fetch('/api/admin/prayers', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error('Failed to delete prayer');
        setMessage('Prayer deleted successfully!');
        fetchPrayers();
      } catch (err) {
        setMessage(`Error deleting prayer: ${err.message}`);
      }
    }
  };

  return (
    <div>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Prayer Request</h5>
          <form onSubmit={handleAddPrayer}>
            <div className="mb-3">
              <label htmlFor="request" className="form-label">Request</label>
              <textarea className="form-control" id="request" name="request" rows="3" value={newPrayer.request} onChange={handleInputChange} required></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="author" className="form-label">Author (Optional)</label>
              <input type="text" className="form-control" id="author" name="author" value={newPrayer.author} onChange={handleInputChange} />
            </div>
            <button type="submit" className="btn btn-primary">Add Prayer</button>
          </form>
        </div>
      </div>

      <h2>Existing Prayer Requests</h2>
      <div className="list-group mb-4">
        {prayers.length > 0 ? (
          prayers.map(prayer => (
            <div key={prayer.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{prayer.request}</h5>
                <p><small>By {prayer.author || 'Anonymous'} on {new Date(prayer.date).toLocaleDateString()}</small></p>
              </div>
              <div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(prayer)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeletePrayer(prayer.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No prayer requests found.</p>
        )}
      </div>

      {/* Edit Prayer Modal */}
      {editingPrayer && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Prayer Request</h5>
                <button type="button" className="btn-close" onClick={() => setEditingPrayer(null)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="editRequest" className="form-label">Request</label>
                    <textarea className="form-control" id="editRequest" name="request" rows="3" value={editingPrayer.request} onChange={handleEditInputChange} required></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editAuthor" className="form-label">Author (Optional)</label>
                    <input type="text" className="form-control" id="editAuthor" name="author" value={editingPrayer.author} onChange={handleEditInputChange} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingPrayer(null)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdatePrayer}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
