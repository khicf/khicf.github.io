"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePageClient() {
  const { data: session, update } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user?.name) {
      setNewUsername(session.user.name);
    }
  }, [session]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    const res = await fetch("/api/user/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      setMessage("Username cannot be empty.");
      return;
    }

    const res = await fetch("/api/user/username", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newUsername }),
    });

    const data = await res.json();
    setMessage(data.message);
    
    if (res.ok) {
      // Update the session to reflect the new username
      await update();
    }
  };

  return (
    <div className="container py-4">
      {/* Page Hero Section */}
      <header className="page-hero row align-items-center justify-content-between mb-4 pb-3 border-bottom border-light">
        <div className="col-md-8">
          <h1 className="display-6 mb-2 fw-bold">Profile Settings</h1>
          <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>
            Manage your account settings and security preferences
          </p>
        </div>
      </header>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Success/Error Messages */}
          {message && (
            <div
              className={`alert ${
                message.includes("Error") ||
                message.includes("not match") ||
                message.includes("incorrect") ||
                message.includes("cannot be empty") ||
                message.includes("same as current") ||
                message.includes("must be between")
                  ? "alert-danger"
                  : "alert-success"
              } alert-dismissible fade show`}
              role="alert"
            >
              <strong>
                {message.includes("Error") ||
                message.includes("not match") ||
                message.includes("incorrect") ||
                message.includes("cannot be empty") ||
                message.includes("same as current") ||
                message.includes("must be between")
                  ? "❌ Error:"
                  : "✅ Success:"}
              </strong>{" "}
              {message}
              <button
                type="button"
                className="btn-close"
                onClick={() => setMessage("")}
              ></button>
            </div>
          )}

          {/* Change Username Card */}
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: "12px" }}
          >
            <div className="card-header bg-transparent border-0 pt-4 pb-0">
              <h5 className="card-title fw-bold d-flex align-items-center mb-3">
                Change Username
              </h5>
              <p className="text-muted mb-0">
                Update your display name that will be shown to other users.
              </p>
            </div>
            <div className="card-body pt-3">
              <form onSubmit={handleChangeUsername}>
                <div className="mb-4">
                  <label
                    htmlFor="newUsername"
                    className="form-label fw-semibold"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="newUsername"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                    style={{
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      fontSize: "0.95rem",
                    }}
                    placeholder="Enter your username"
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setNewUsername(session?.user?.name || "");
                      setMessage("");
                    }}
                    style={{ borderRadius: "8px", padding: "0.5rem 1.5rem" }}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!newUsername.trim() || newUsername === session?.user?.name}
                    style={{ borderRadius: "8px", padding: "0.5rem 2rem" }}
                  >
                    Update Username
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password Card */}
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "12px" }}
          >
            <div className="card-header bg-transparent border-0 pt-4 pb-0">
              <h5 className="card-title fw-bold d-flex align-items-center mb-3">
                Change Password
              </h5>
              <p className="text-muted mb-0">
                Keep your account secure by using a strong, unique password.
              </p>
            </div>
            <div className="card-body pt-3">
              <form onSubmit={handleChangePassword}>
                <div className="mb-4">
                  <label
                    htmlFor="currentPassword"
                    className="form-label fw-semibold"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    style={{
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      fontSize: "0.95rem",
                    }}
                    placeholder="Enter your current password"
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label
                      htmlFor="newPassword"
                      className="form-label fw-semibold"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      style={{
                        borderRadius: "8px",
                        padding: "0.75rem 1rem",
                        fontSize: "0.95rem",
                      }}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-semibold"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{
                        borderRadius: "8px",
                        padding: "0.75rem 1rem",
                        fontSize: "0.95rem",
                      }}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setMessage("");
                    }}
                    style={{ borderRadius: "8px", padding: "0.5rem 1.5rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      !currentPassword || !newPassword || !confirmPassword
                    }
                    style={{ borderRadius: "8px", padding: "0.5rem 2rem" }}
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
