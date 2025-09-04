"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppreciationWallPageClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appreciations, setAppreciations] = useState([]);
  const [filteredAppreciations, setFilteredAppreciations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [postMessage, setPostMessage] = useState("");
  const [editingAppreciation, setEditingAppreciation] = useState(null);
  const [editAppreciationText, setEditAppreciationText] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    } else if (status === "authenticated") {
      fetchAppreciations();
    }
  }, [session, status, router]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results = appreciations.filter(
      (appreciation) =>
        appreciation.message.toLowerCase().includes(lowerCaseSearchTerm) ||
        appreciation.user.name.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredAppreciations(results);
  }, [searchTerm, appreciations]);

  const fetchAppreciations = async () => {
    try {
      const res = await fetch("/api/appreciations");
      if (!res.ok) throw new Error("Failed to fetch appreciations");
      const data = await res.json();
      setAppreciations(data.appreciations);
      setFilteredAppreciations(data.appreciations);
    } catch (err) {
      setPostMessage(`Error fetching appreciations: ${err.message}`);
    }
  };

  const handlePostMessage = async (e) => {
    e.preventDefault();
    if (!message) {
      setPostMessage("Please enter a message.");
      return;
    }

    try {
      const res = await fetch("/api/appreciations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to post message");
      }

      setPostMessage(data.message);
      setMessage("");
      fetchAppreciations();
    } catch (err) {
      setPostMessage(`Error posting message: ${err.message}`);
    }
  };

  const startEditingAppreciation = (appreciation) => {
    setEditingAppreciation(appreciation.id);
    setEditAppreciationText(appreciation.message);
  };

  const cancelEditingAppreciation = () => {
    setEditingAppreciation(null);
    setEditAppreciationText("");
  };

  const handleAppreciationUpdate = async (appreciationId) => {
    if (!editAppreciationText.trim()) return;

    try {
      const res = await fetch(`/api/appreciations/${appreciationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: editAppreciationText }),
      });

      if (res.ok) {
        fetchAppreciations();
        setEditingAppreciation(null);
        setEditAppreciationText("");
        setPostMessage("Appreciation updated successfully!");
      } else {
        const data = await res.json();
        setPostMessage(`Error updating appreciation: ${data.message}`);
      }
    } catch (err) {
      setPostMessage(`Error updating appreciation: ${err.message}`);
    }
  };

  const handleAppreciationDelete = async (appreciationId) => {
    if (!confirm("Are you sure you want to delete this appreciation?")) return;

    try {
      const res = await fetch(`/api/appreciations/${appreciationId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchAppreciations();
        setPostMessage("Appreciation deleted successfully!");
      } else {
        const data = await res.json();
        setPostMessage(`Error deleting appreciation: ${data.message}`);
      }
    } catch (err) {
      setPostMessage(`Error deleting appreciation: ${err.message}`);
    }
  };

  const canEditContent = (content) => {
    if (!session || !session.user) return false;

    // Admins can edit any content
    if (session.user.role === "ADMIN") return true;

    // Check if user owns the content by email (more reliable than ID matching)
    if (content.user && content.user.email === session.user.email) return true;

    // Fallback: check by userId if available
    if (content.userId && session.user.id === content.userId) return true;

    return false;
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="container py-4">
        {/* Page Hero Section */}
        <header className="page-hero row align-items-center justify-content-between mb-4 pb-3 border-bottom border-light">
          <div className="col-md-8">
            <h1 className="display-6 mb-2 fw-bold">Appreciation Wall</h1>
            <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>
              Share gratitude and celebrate our community members
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <Link
              href="/appreciation/new"
              className="btn btn-primary"
              style={{ fontSize: "0.95rem", padding: "0.5rem 1.25rem" }}
            >
              Post an Appreciation
            </Link>
          </div>
        </header>

        {/* Controls Bar */}
        <div className="controls-bar row g-3 align-items-center mb-4">
          <div className="col-md-8">
            <div className="position-relative">
              <input
                type="text"
                className="form-control pe-5"
                placeholder="Search appreciations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: "0.95rem", padding: "0.65rem 1rem" }}
              />
              {searchTerm && (
                <button
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  style={{ zIndex: 5 }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-12">
          {postMessage && (
            <div
              className={`alert ${
                postMessage.includes("Error") ? "alert-danger" : "alert-success"
              } alert-dismissible fade show mb-4`}
              role="alert"
            >
              {postMessage}
              <button
                type="button"
                className="btn-close"
                onClick={() => setPostMessage("")}
                aria-label="Close"
              ></button>
            </div>
          )}
          <h2 className="mb-4">Recent Appreciations</h2>
          {filteredAppreciations.length > 0 ? (
            filteredAppreciations.map((appreciation) => (
              <div key={appreciation.id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="flex-grow-1">
                      {editingAppreciation === appreciation.id ? (
                        <div className="edit-appreciation-form">
                          <div className="mb-3">
                            <textarea
                              className="form-control"
                              rows="3"
                              value={editAppreciationText}
                              onChange={(e) =>
                                setEditAppreciationText(e.target.value)
                              }
                              placeholder="Edit your appreciation message..."
                              style={{ borderRadius: "8px" }}
                            />
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                handleAppreciationUpdate(appreciation.id)
                              }
                              disabled={!editAppreciationText.trim()}
                            >
                              Save Changes
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={cancelEditingAppreciation}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="card-text mb-0">{appreciation.message}</p>
                      )}
                    </div>
                    {session &&
                      canEditContent(appreciation) &&
                      editingAppreciation !== appreciation.id && (
                        <div className="dropdown">
                          <button
                            className="btn btn-link text-muted p-1"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  startEditingAppreciation(appreciation)
                                }
                              >
                                Edit Appreciation
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() =>
                                  handleAppreciationDelete(appreciation.id)
                                }
                              >
                                Delete Appreciation
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                  </div>
                  {editingAppreciation !== appreciation.id && (
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        From: {appreciation.user.name}
                      </small>
                      <small className="text-muted">
                        {new Date(appreciation.createdAt).toLocaleDateString('en-US', {
                          timeZone: 'America/Chicago'
                        })}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state text-center py-5">
              <h3 className="text-muted mb-3">No appreciations found</h3>
              <p className="text-muted mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Be the first to share gratitude with the community!"}
              </p>
              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </button>
                )}
                <Link href="/appreciation/new" className="btn btn-primary">
                  Post an Appreciation
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
