'use client';

import { useState, useEffect } from 'react';

export default function AdminAppreciations() {
  const [appreciations, setAppreciations] = useState([]);
  const [editingAppreciation, setEditingAppreciation] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAppreciations();
  }, []);

  const fetchAppreciations = async () => {
    try {
      const res = await fetch('/api/appreciations');
      if (!res.ok) throw new Error('Failed to fetch appreciations');
      const data = await res.json();
      setAppreciations(data.appreciations);
    } catch (err) {
      setMessage(`Error fetching appreciations: ${err.message}`);
    }
  };

  const handleEditClick = (appreciation) => {
    setEditingAppreciation({ ...appreciation });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingAppreciation({ ...editingAppreciation, [name]: value });
  };

  const handleUpdateAppreciation = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/appreciations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAppreciation),
      });
      if (!res.ok) throw new Error('Failed to update appreciation');
      setMessage('Appreciation updated successfully!');
      setEditingAppreciation(null);
      fetchAppreciations();
    } catch (err) {
      setMessage(`Error updating appreciation: ${err.message}`);
    }
  };

  const handleDeleteAppreciation = async (id) => {
    if (!confirm('Are you sure you want to delete this appreciation?')) return;
    
    try {
      const res = await fetch('/api/admin/appreciations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete appreciation');
      setMessage('Appreciation deleted successfully!');
      fetchAppreciations();
    } catch (err) {
      setMessage(`Error deleting appreciation: ${err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingAppreciation(null);
  };

  return (
    <div className="admin-appreciations">
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`}>
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {/* Edit Appreciation Modal/Form */}
      {editingAppreciation && (
        <div className="card mb-4 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="card-header bg-transparent border-0 pt-4 pb-0">
            <h5 className="card-title fw-bold mb-3">
              Edit Appreciation
            </h5>
          </div>
          <div className="card-body pt-2">
            <form onSubmit={handleUpdateAppreciation}>
              <div className="mb-3">
                <label htmlFor="editMessage" className="form-label">Message</label>
                <textarea
                  className="form-control"
                  id="editMessage"
                  name="message"
                  rows="4"
                  value={editingAppreciation.message}
                  onChange={handleEditInputChange}
                  required
                  style={{ borderRadius: '8px' }}
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.5rem 2rem' }}>
                  Update Appreciation
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit} style={{ borderRadius: '8px', padding: '0.5rem 2rem' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appreciations List */}
      <div className="appreciations-list">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0 fw-bold d-flex align-items-center">
            Appreciation Messages
            {appreciations.length > 0 && (
              <span className="badge bg-primary ms-2">{appreciations.length}</span>
            )}
          </h2>
        </div>

        {appreciations.length > 0 ? (
          <div className="row">
            {appreciations.map(appreciation => (
              <div key={appreciation.id} className="col-12 mb-4">
                <div className="card appreciation-admin-card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-4">
                    <div className="appreciation-header d-flex align-items-start justify-content-between mb-3">
                      <div className="appreciation-meta d-flex align-items-center flex-grow-1">
                        <div className="author-avatar me-3">
                          <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                            <span className="fw-bold text-primary" style={{ fontSize: '1.2rem' }}>
                              {(appreciation.user?.name || 'Anonymous').charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <div className="appreciation-author d-flex align-items-center mb-2">
                            <span className="fw-semibold text-dark me-2">{appreciation.user?.name || 'Anonymous'}</span>
                            <span className="text-muted small">
                              {new Date(appreciation.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="appreciation-content mb-4">
                      <p className="mb-0 text-dark" style={{ lineHeight: '1.6' }}>
                        {appreciation.message}
                      </p>
                    </div>

                    <div className="appreciation-actions d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm flex-fill"
                        onClick={() => handleEditClick(appreciation)}
                        style={{ borderRadius: '6px' }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm flex-fill"
                        onClick={() => handleDeleteAppreciation(appreciation.id)}
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
            <h4 className="text-muted mb-3">No appreciations shared yet</h4>
            <p className="text-muted">Community members haven't shared any appreciations yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}