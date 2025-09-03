'use client';

import { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = () => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        setApprovedUsers(data.users.filter(user => user.approved));
        setUnapprovedUsers(data.users.filter(user => !user.approved));
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const res = await fetch(`/api/admin/users/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      }
    );

    if (res.ok) {
      fetchUsers();
    }
  };

  const handleApprove = async (userId) => {
    const res = await fetch(`/api/admin/users/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: true }),
      }
    );

    if (res.ok) {
      fetchUsers();
    }
  };

  const handleDeny = async (userId) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchUsers();
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchUsers();
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });
      if (!res.ok) throw new Error('Failed to update user');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  return (
    <div>
      <h2>New User Requests</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {unapprovedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button className="btn btn-success me-2" onClick={() => handleApprove(user.id)}>Approve</button>
                <button className="btn btn-danger" onClick={() => handleDeny(user.id)}>Deny</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-5">Approved Users</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {approvedUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  className="form-select d-inline-block w-auto me-2"
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="USER">USER</option>
                  <option value="CORE">CORE</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <button className="btn btn-primary me-2" onClick={() => handleEditClick(user)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setEditingUser(null)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="editName" className="form-label">Name</label>
                    <input type="text" className="form-control" id="editName" name="name" value={editingUser.name} onChange={handleEditInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editEmail" className="form-label">Email</label>
                    <input type="email" className="form-control" id="editEmail" name="email" value={editingUser.email} readOnly disabled />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editRole" className="form-label">Role</label>
                    <select className="form-select" id="editRole" name="role" value={editingUser.role} onChange={handleEditInputChange}>
                      <option value="USER">USER</option>
                      <option value="CORE">CORE</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingUser(null)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateUser}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}