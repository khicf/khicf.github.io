'use client';

import { useState, useEffect } from 'react';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    location: '',
    contact: '',
    fullDescription: '',
    isPublic: true,
  });
  const [editingEvent, setEditingEvent] = useState(null); // State to hold event being edited
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events?show=all');
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      setEvents(data.events);
    } catch (err) {
      setMessage(`Error fetching events: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEvent({ ...newEvent, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      if (!res.ok) throw new Error('Failed to add event');
      setMessage('Event added successfully!');
      setNewEvent({
        title: '',
        date: '',
        time: '',
        description: '',
        location: '',
        contact: '',
        fullDescription: '',
        isPublic: true,
      });
      fetchEvents(); // Refresh the list
    } catch (err) {
      setMessage(`Error adding event: ${err.message}`);
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent({ ...event }); // Set the event to be edited
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingEvent({ ...editingEvent, [name]: type === 'checkbox' ? checked : value });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEvent),
      });
      if (!res.ok) throw new Error('Failed to update event');
      setMessage('Event updated successfully!');
      setEditingEvent(null); // Close the modal
      fetchEvents(); // Refresh the list
    } catch (err) {
      setMessage(`Error updating event: ${err.message}`);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const res = await fetch('/api/admin/events', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error('Failed to delete event');
        setMessage('Event deleted successfully!');
        fetchEvents(); // Refresh the list
      } catch (err) {
        setMessage(`Error deleting event: ${err.message}`);
      }
    }
  };

  return (
    <div className="admin-events">
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`} role="alert">
          <strong>{message.includes('Error') ? '❌ Error:' : '✅ Success:'}</strong> {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {/* Add Event Form */}
      <div className="card mb-4 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="card-header bg-transparent border-0 pt-4 pb-0">
          <h5 className="card-title fw-bold d-flex align-items-center mb-3">
            <span className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
              <span style={{ fontSize: '1.2rem' }}>📅</span>
            </span>
            Add New Event
          </h5>
        </div>
        <div className="card-body pt-2">
          <form onSubmit={handleAddEvent}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" id="title" name="title" value={newEvent.title} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">Date</label>
              <input type="date" className="form-control" id="date" name="date" value={newEvent.date} onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="time" className="form-label">Time</label>
              <input type="text" className="form-control" id="time" name="time" value={newEvent.time} onChange={handleInputChange} placeholder="e.g., 7:00 PM" />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Short Description</label>
              <textarea className="form-control" id="description" name="description" rows="2" value={newEvent.description} onChange={handleInputChange} required></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Location</label>
              <input type="text" className="form-control" id="location" name="location" value={newEvent.location} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="contact" className="form-label">Contact</label>
              <input type="text" className="form-control" id="contact" name="contact" value={newEvent.contact} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="fullDescription" className="form-label">Full Description</label>
              <textarea className="form-control" id="fullDescription" name="fullDescription" rows="4" value={newEvent.fullDescription} onChange={handleInputChange}></textarea>
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="isPublic" name="isPublic" checked={newEvent.isPublic} onChange={handleInputChange} />
              <label className="form-check-label" htmlFor="isPublic">Public Event</label>
            </div>
            <button type="submit" className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.5rem 2rem' }}>
              📅 Add Event
            </button>
          </form>
        </div>
      </div>

      {/* Events List */}
      <div className="events-list">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0 fw-bold d-flex align-items-center">
            <span className="me-2">📋</span>
            Existing Events
            {events.length > 0 && (
              <span className="badge bg-primary ms-2">{events.length}</span>
            )}
          </h2>
        </div>

        {events.length > 0 ? (
          <div className="row g-3">
            {events.map(event => (
              <div key={event.id} className="col-lg-6 col-xl-4">
                <div className="event-admin-card card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-4">
                    <div className="event-header mb-3">
                      <div className="d-flex align-items-start justify-content-between">
                        <div className="flex-grow-1">
                          <h5 className="fw-bold text-dark mb-1">{event.title}</h5>
                          <div className="event-meta text-muted small mb-2">
                            <div className="d-flex align-items-center mb-1">
                              <span className="me-2">📅</span>
                              <span>{new Date(event.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                              {event.time && <span className="ms-2">at {event.time}</span>}
                            </div>
                            {event.location && (
                              <div className="d-flex align-items-center">
                                <span className="me-2">📍</span>
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {!event.isPublic && (
                          <span className="badge bg-secondary bg-opacity-20 text-secondary px-2 py-1" style={{ borderRadius: '20px', fontSize: '0.75rem' }}>
                            🔒 Private
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="event-description mb-3">
                      <p className="text-muted mb-0" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {event.description}
                      </p>
                    </div>

                    <div className="event-actions d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm flex-fill"
                        onClick={() => handleEditClick(event)}
                        style={{ borderRadius: '6px' }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm flex-fill"
                        onClick={() => handleDeleteEvent(event.id)}
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
              <span className="display-1 text-muted">📅</span>
            </div>
            <h4 className="text-muted mb-3">No events created yet</h4>
            <p className="text-muted">Start by adding your first community event above.</p>
          </div>
        )}
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Event</h5>
                <button type="button" className="btn-close" onClick={() => setEditingEvent(null)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="editTitle" className="form-label">Title</label>
                    <input type="text" className="form-control" id="editTitle" name="title" value={editingEvent.title} onChange={handleEditInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDate" className="form-label">Date</label>
                    <input type="date" className="form-control" id="editDate" name="date" value={editingEvent.date} onChange={handleEditInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editTime" className="form-label">Time</label>
                    <input type="text" className="form-control" id="editTime" name="time" value={editingEvent.time} onChange={handleEditInputChange} placeholder="e.g., 7:00 PM" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDescription" className="form-label">Short Description</label>
                    <textarea className="form-control" id="editDescription" name="description" rows="2" value={editingEvent.description} onChange={handleEditInputChange} required></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editLocation" className="form-label">Location</label>
                    <input type="text" className="form-control" id="editLocation" name="location" value={editingEvent.location} onChange={handleEditInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editContact" className="form-label">Contact</label>
                    <input type="text" className="form-control" id="editContact" name="contact" value={editingEvent.contact} onChange={handleEditInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editFullDescription" className="form-label">Full Description</label>
                    <textarea className="form-control" id="editFullDescription" name="fullDescription" rows="4" value={editingEvent.fullDescription} onChange={handleEditInputChange}></textarea>
                  </div>
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="editIsPublic" name="isPublic" checked={editingEvent.isPublic} onChange={handleEditInputChange} />
                    <label className="form-check-label" htmlFor="editIsPublic">Public Event</label>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingEvent(null)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateEvent}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
