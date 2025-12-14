"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/components/auth/protected-route";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const menuItems = [
  { icon: "📊", label: "Dashboard", href: "/dashboard/student" },
  { icon: "⚠️", label: "Submit Complaint", href: "/dashboard/student/complaint" },
  { icon: "📋", label: "Complaint Status", href: "/dashboard/student/complaints" },
];

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch complaints
  useEffect(() => {
    async function fetchComplaints() {
      try {
        const res = await fetch(`${API}/dashboard/student`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        setComplaints(data.complaints || []);
      } catch (err) {
        console.error("COMPLAINT LIST ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchComplaints();
  }, []);

  // Delete pending complaint
  const deleteComplaint = async (id: string) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;

    try {
      const res = await fetch(`${API}/complaints/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete");
        return;
      }

      // Remove from UI
      setComplaints((prev) => prev.filter((c) => c._id !== id));
      alert("Complaint deleted");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  if (loading)
    return (
      <DashboardLayout menuItems={menuItems} role="Student" userName="Student">
        <div className="p-6">Loading complaints...</div>
      </DashboardLayout>
    );

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DashboardLayout menuItems={menuItems} role="Student" userName="Student">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/student"
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </Link>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Complaint Status</h2>
              <p className="text-muted-foreground mt-1">Track your submitted complaints</p>
            </div>
          </div>

          {/* No complaints */}
          {complaints.length === 0 && (
            <p className="text-muted-foreground text-center mt-10">
              No complaints submitted yet.
            </p>
          )}

          {/* Complaint list */}
          <div className="space-y-4">
            {complaints.map((c) => (
              <div
                key={c._id}
                className="bg-card border border-border rounded-lg p-6 relative"
              >
                {/* Status Badge */}
                <span
                  className={`absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-medium capitalize ${c.status === "closed"
                      ? "bg-green-100 text-green-800"
                      : c.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : c.status === "not-resolvable"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {c.status}
                </span>

                {/* Complaint Info */}
                <div className="mb-4">
                  <p className="font-semibold text-foreground text-lg capitalize">
                    {c.category}
                  </p>
                  <p className="text-muted-foreground mt-1">{c.description}</p>
                </div>

                {/* Resolution Image */}
                {c.resolutionImageUrl && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Resolution Photo:</p>
                    <img
                      src={c.resolutionImageUrl}
                      alt="Resolution"
                      className="rounded-lg border border-border w-64 object-cover"
                    />
                  </div>
                )}

                {/* Warden Note */}
                {c.status === "closed" && c.wardenNote && (
                  <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Warden Note:</strong> {c.wardenNote}
                    </p>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="font-medium text-foreground">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {c.status === "closed" && (
                    <div>
                      <p className="text-xs text-muted-foreground">Resolved</p>
                      <p className="font-medium text-foreground">
                        {new Date(c.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* BIN BUTTON - moved to bottom right */}
                {c.status === "pending" && (
                  <button
                    onClick={() => deleteComplaint(c._id)}
                    className="absolute bottom-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={22} />
                  </button>
                )}
              </div>

            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
