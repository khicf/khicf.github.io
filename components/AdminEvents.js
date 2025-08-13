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
  });
  const [editingEvent, setEditingEvent] = useState(null); // State to hold event being edited
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      setEvents(data.events);
    } catch (err) {
      setMessage(`Error fetching events: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
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
    const { name, value } = e.target;
    setEditingEvent({ ...editingEvent, [name]: value });
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
    <div>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Event</h5>
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
              <input type="text" className="form-control" id="time" name="time" value={newEvent.time} onChange={handleInputChange} placeholder="e.g., 7:00 PM" required />
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
            <button type="submit" className="btn btn-primary">Add Event</button>
          </form>
        </div>
      </div>

      <h2>Existing Events</h2>
      <div className="list-group mb-4">
        {events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{event.title}</h5>
                <p><small>{event.date} at {event.time} - {event.location}</small></p>
                <p>{event.description}</p>
              </div>
              <div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(event)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEvent(event.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No events found.</p>
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
                    <input type="text" className="form-control" id="editTime" name="time" value={editingEvent.time} onChange={handleEditInputChange} placeholder="e.g., 7:00 PM" required />
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
