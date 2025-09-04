"use client";

import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = () => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setApprovedUsers(data.users.filter((user) => user.approved));
        setUnapprovedUsers(data.users.filter((user) => !user.approved));
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      fetchUsers();
    }
  };

  const handleApprove = async (userId) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approved: true }),
    });

    if (res.ok) {
      fetchUsers();
    }
  };

  const handleDeny = async (userId) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchUsers();
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });
      if (!res.ok) throw new Error("Failed to update user");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
    <div className="container py-4">
      {/* Page Hero Section */}
      <header className="page-hero row align-items-center justify-content-between mb-4 pb-3 border-bottom border-light">
        <div className="col-md-8">
          <h1 className="display-6 mb-2 fw-bold">User Management</h1>
          <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>
            Manage user registrations and permissions
          </p>
        </div>
      </header>

      {/* New User Requests Section */}
      <div className="mb-5">
        <h2 className="mb-4 d-flex align-items-center">
          New User Requests
          {unapprovedUsers.length > 0 && (
            <span className="badge bg-primary text-white ms-2">
              {unapprovedUsers.length}
            </span>
          )}
        </h2>

        {unapprovedUsers.length > 0 ? (
          <div className="row">
            {unapprovedUsers.map((user) => (
              <div key={user.id} className="col-md-6 col-lg-4 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{user.name}</h5>
                    <p className="card-text text-muted">{user.email}</p>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success btn-sm flex-fill"
                        onClick={() => handleApprove(user.id)}
                      >
                        ✓ Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm flex-fill"
                        onClick={() => handleDeny(user.id)}
                      >
                        ✕ Deny
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state text-center py-4">
            <h4 className="text-muted mb-2">No pending requests</h4>
            <p className="text-muted">
              All user registrations have been processed.
            </p>
          </div>
        )}
      </div>

      {/* Approved Users Section */}
      <div>
        <h2 className="mb-4 d-flex align-items-center">
          Approved Users
          <span className="badge bg-primary ms-2">{approvedUsers.length}</span>
        </h2>

        {approvedUsers.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="fw-semibold">{user.name}</td>
                    <td className="text-muted">{user.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "ADMIN"
                            ? "bg-danger"
                            : user.role === "CORE"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 align-items-center">
                        <select
                          className="form-select form-select-sm"
                          style={{ width: "auto", minWidth: "100px" }}
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          title="Change role"
                        >
                          <option value="USER">USER</option>
                          <option value="CORE">CORE</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEditClick(user)}
                          title="Edit user"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(user.id)}
                          title="Delete user"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state text-center py-4">
            <div className="mb-3"></div>
            <h4 className="text-muted mb-2">No approved users</h4>
            <p className="text-muted">No users have been approved yet.</p>
          </div>
        )}
      </div>

      {/* Enhanced Edit User Modal */}
      {editingUser && (
        <div className="modal-backdrop" onClick={() => setEditingUser(null)}>
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content"
              style={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 16px 32px rgba(0,0,0,0.15)",
              }}
            >
              <div
                className="modal-header"
                style={{
                  background: "linear-gradient(135deg, #f8f9ff 0%, #fff 100%)",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <h5 className="modal-title fw-bold d-flex align-items-center">
                  <span className="me-2">✏️</span>
                  Edit User
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingUser(null)}
                  style={{ fontSize: "1.2rem" }}
                ></button>
              </div>
              <div className="modal-body" style={{ padding: "2rem" }}>
                <form>
                  <div className="mb-3">
                    <label
                      htmlFor="editName"
                      className="form-label fw-semibold"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="editName"
                      name="name"
                      value={editingUser.name}
                      onChange={handleEditInputChange}
                      required
                      style={{ borderRadius: "8px", padding: "0.75rem 1rem" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="editEmail"
                      className="form-label fw-semibold"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="editEmail"
                      name="email"
                      value={editingUser.email}
                      readOnly
                      disabled
                      style={{
                        borderRadius: "8px",
                        padding: "0.75rem 1rem",
                        backgroundColor: "#f8f9fa",
                      }}
                    />
                    <small className="text-muted">
                      Email addresses cannot be modified
                    </small>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="editRole"
                      className="form-label fw-semibold"
                    >
                      Role
                    </label>
                    <select
                      className="form-select"
                      id="editRole"
                      name="role"
                      value={editingUser.role}
                      onChange={handleEditInputChange}
                      style={{ borderRadius: "8px", padding: "0.75rem 1rem" }}
                    >
                      <option value="USER">USER - Standard access</option>
                      <option value="CORE">CORE - Enhanced permissions</option>
                      <option value="ADMIN">
                        ADMIN - Full administrative access
                      </option>
                    </select>
                  </div>
                </form>
              </div>
              <div
                className="modal-footer"
                style={{
                  borderTop: "1px solid #e0e0e0",
                  padding: "1.5rem 2rem",
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setEditingUser(null)}
                  style={{ borderRadius: "6px", padding: "0.5rem 1.5rem" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateUser}
                  style={{ borderRadius: "6px", padding: "0.5rem 1.5rem" }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
