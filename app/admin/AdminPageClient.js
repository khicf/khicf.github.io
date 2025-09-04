"use client";

import AdminEvents from "@/components/AdminEvents";
import AdminPrayers from "@/components/AdminPrayers";
import AdminScriptures from "@/components/AdminScriptures";
import AdminAppreciations from "@/components/AdminAppreciations";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function AdminPageClient() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("events");

  return (
    <div className="container py-4">
      {/* Page Hero Section */}
      <header className="page-hero row align-items-center justify-content-between mb-4 pb-3 border-bottom border-light">
        <div className="col-md-8">
          <h1 className="display-6 mb-2 fw-bold">Admin Panel</h1>
          <p className="text-muted mb-0" style={{ fontSize: "1.1rem" }}>
            Manage community content and user access
          </p>
        </div>
        <div className="col-md-4 text-md-end mt-3 mt-md-0">
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin/users"
              className="btn btn-primary"
              style={{ fontSize: "0.95rem", padding: "0.5rem 1.25rem" }}
            >
              Manage Users
            </Link>
          )}
        </div>
      </header>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            Events
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "prayers" ? "active" : ""}`}
            onClick={() => setActiveTab("prayers")}
          >
            Prayers
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "scriptures" ? "active" : ""}`}
            onClick={() => setActiveTab("scriptures")}
          >
            Scriptures
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "appreciations" ? "active" : ""}`}
            onClick={() => setActiveTab("appreciations")}
          >
            Appreciations
          </button>
        </li>
      </ul>

      <div>
        {activeTab === "events" && <AdminEvents />}
        {activeTab === "prayers" && <AdminPrayers />}
        {activeTab === "scriptures" && <AdminScriptures />}
        {activeTab === "appreciations" && <AdminAppreciations />}
      </div>
    </div>
  );
}
