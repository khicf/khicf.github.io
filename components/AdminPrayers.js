'use client';

import { useState, useEffect } from 'react';

export default function AdminPrayers() {
  const [prayers, setPrayers] = useState([]);
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

  const handleToggleVisibility = async (prayer) => {
    try {
      const res = await fetch('/api/admin/prayers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prayer, isPublic: !prayer.isPublic }),
      });
      if (!res.ok) throw new Error('Failed to update prayer visibility');
      setMessage('Prayer visibility updated successfully!');
      fetchPrayers();
    } catch (err) {
      setMessage(`Error updating prayer visibility: ${err.message}`);
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
    <div className="admin-prayers">
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`} role="alert">
          <strong>{message.includes('Error') ? '❌ Error:' : '✅ Success:'}</strong> {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {/* Prayers List */}
      <div className="prayers-list">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0 fw-bold d-flex align-items-center">
            <span className="me-2">🙏</span>
            Prayer Requests
            {prayers.length > 0 && (
              <span className="badge bg-primary ms-2">{prayers.length}</span>
            )}
          </h2>
        </div>

        {prayers.length > 0 ? (
          <div className="row g-3">
            {prayers.map(prayer => (
              <div key={prayer.id} className="col-lg-6 col-xl-4">
                <div className="prayer-admin-card card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-4">
                    <div className="prayer-header mb-3">
                      <div className="d-flex align-items-start justify-content-between">
                        <div className="flex-grow-1">
                          <div className="prayer-meta text-muted small mb-2">
                            <div className="d-flex align-items-center mb-1">
                              <span className="me-2">👤</span>
                              <span>By {prayer.author || 'Anonymous'}</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="me-2">📅</span>
                              <span>{new Date(prayer.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                          </div>
                        </div>
                        {!prayer.isPublic && (
                          <span className="badge bg-secondary bg-opacity-20 text-secondary px-2 py-1" style={{ borderRadius: '20px', fontSize: '0.75rem' }}>
                            🔒 Private
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="prayer-content mb-3">
                      <p className="text-dark mb-0" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.5'
                      }}>
                        {prayer.request}
                      </p>
                    </div>

                    <div className="prayer-actions d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm flex-fill"
                        onClick={() => handleEditClick(prayer)}
                        style={{ borderRadius: '6px' }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className={`btn btn-outline-secondary btn-sm flex-fill ${!prayer.isPublic ? 'btn-outline-success' : ''}`}
                        onClick={() => handleToggleVisibility(prayer)}
                        style={{ borderRadius: '6px' }}
                      >
                        {prayer.isPublic ? '🔒 Private' : '🌐 Public'}
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm flex-fill"
                        onClick={() => handleDeletePrayer(prayer.id)}
                        style={{ borderRadius: '6px' }}
                      >
                        🗑️ Delete
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
              <span className="display-1 text-muted">🙏</span>
            </div>
            <h4 className="text-muted mb-3">No prayer requests found</h4>
            <p className="text-muted">Prayer requests will appear here once they are submitted by community members.</p>
          </div>
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
