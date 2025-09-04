"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateUserClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create user");
      }

      setSuccess(`User "${formData.name}" created successfully!`);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "USER",
      });

      setTimeout(() => {
        router.push("/admin/users");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password });
  };

  return (
    <div className="container py-4">
      <header className="page-hero row align-items-center justify-content-between mb-4 pb-3 border-bottom border-light">
        <div className="col-md-8">
          <nav aria-label="breadcrumb" className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/admin" className="text-decoration-none">
                  Admin
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/admin/users" className="text-decoration-none">
                  Users
                </Link>
              </li>
              <li className="breadcrumb-item active">Create User</li>
            </ol>
          </nav>
          <h1 className="display-6 mb-2 fw-bold">Create New User</h1>
          <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>
            Add a new user directly to the system
          </p>
        </div>
        <div className="col-md-4 text-end">
          <Link href="/admin/users" className="btn btn-outline-secondary">
            ← Back to Users
          </Link>
        </div>
      </header>

      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-6">
          <div
            className="card shadow-sm"
            style={{ borderRadius: "12px", border: "1px solid #e0e0e0" }}
          >
            <div
              className="card-header"
              style={{
                background: "linear-gradient(135deg, #f8f9ff 0%, #fff 100%)",
                borderBottom: "1px solid #e0e0e0",
                borderRadius: "12px 12px 0 0",
              }}
            >
              <h5 className="card-title mb-0 fw-bold d-flex align-items-center">
                User Information
              </h5>
            </div>
            <div className="card-body" style={{ padding: "2rem" }}>
              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center"
                  style={{ borderRadius: "8px" }}
                >
                  <span className="me-2">⚠️</span>
                  {error}
                </div>
              )}

              {success && (
                <div
                  className="alert alert-success d-flex align-items-center"
                  style={{ borderRadius: "8px" }}
                >
                  <span className="me-2">✅</span>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{ borderRadius: "8px", padding: "0.75rem 1rem" }}
                    placeholder="Enter user's full name"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{ borderRadius: "8px", padding: "0.75rem 1rem" }}
                    placeholder="Enter user's email address"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength="6"
                      style={{
                        borderRadius: "8px 0 0 8px",
                        padding: "0.75rem 1rem",
                      }}
                      placeholder="Enter password (min. 6 characters)"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={generatePassword}
                      style={{ borderRadius: "0 8px 8px 0" }}
                      title="Generate random password"
                    >
                      Generate
                    </button>
                  </div>
                  <small className="text-muted">
                    Password must be at least 6 characters long
                  </small>
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="form-label fw-semibold">
                    User Role
                  </label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    style={{ borderRadius: "8px", padding: "0.75rem 1rem" }}
                  >
                    <option value="USER">USER - Standard access</option>
                    <option value="CORE">CORE - Enhanced permissions</option>
                    <option value="ADMIN">
                      ADMIN - Full administrative access
                    </option>
                  </select>
                  <small className="text-muted">
                    Choose the appropriate role based on the user's
                    responsibilities
                  </small>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Link
                    href="/admin/users"
                    className="btn btn-outline-secondary"
                    style={{ borderRadius: "8px", padding: "0.75rem 2rem" }}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{ borderRadius: "8px", padding: "0.75rem 2rem" }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating...
                      </>
                    ) : (
                      <>Create User</>
                    )}
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
