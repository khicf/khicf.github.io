'use client';

import { useState, useEffect } from 'react';

export default function AdminUsers() {
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);

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
                  className="form-select"
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}