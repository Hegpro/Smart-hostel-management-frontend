"use client";

import { useState, useEffect, ChangeEvent } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import DataTable from "@/components/dashboard/data-table";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";

const BASE_URL = "http://localhost:5000";

export default function StaffDashboard() {
  const [user, setUser] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);
  const [filterHostel, setFilterHostel] = useState("All");

  // 1️⃣ Get logged-in user
  const getProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) {
        console.error("Profile fetch failed:", await res.text());
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("PROFILE ERROR:", err);
    }
  };

  // 2️⃣ Get complaints + map
  const getComplaints = async () => {
    try {
      if (!user?.hostelId) return;

      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/api/complaints/staff?hostelId=${user.hostelId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Complaints fetch failed:", text);
        setComplaints([]);
        return;
      }

      const data = await res.json();

      const transformed = (data.complaints || []).map((c: any) => ({
        id: c._id,
        room: c.createdBy?.roomId?.roomNumber || "N/A",
        description: c.description || "",
        complaint: c.title || "",
        student: c.createdBy?.name || "Unknown",
        date: c.createdAt ? new Date(c.createdAt).toLocaleString() : "",
        status: c.status,
        hostel: c.hostelId,
        imageUrl: c.imageUrl || null,
        resolutionImageUrl: c.resolutionImageUrl || null,
        raw: c,
      }));

      setComplaints(transformed);

    } catch (err) {
      console.error("FETCH ERROR:", err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (user) getComplaints();
  }, [user]);

  // File input change
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setUploadFile(f);
  };

  // 3️⃣ Update complaint (PUT + FormData)
  const handleStatusChange = async () => {
    if (!selectedComplaint) return;

    setUpdating(true);

    try {
      const form = new FormData();
      form.append("status", newStatus);

      if (uploadFile) {
        form.append("image", uploadFile);
      }

      const res = await fetch(
        `${BASE_URL}/api/complaints/update/${selectedComplaint.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: form,
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        console.error("Update failed:", errText);
        alert(errText);
        return;
      }

      await getComplaints();
      setSelectedComplaint(null);
      setUploadFile(null);

    } catch (err) {
      console.error("UPDATE ERROR:", err);
    } finally {
      setUpdating(false);
    }
  };

  // ⭐ FINAL FILTER — removes not-resolvable complaints
  const visibleComplaints = complaints.filter(
    (c) =>
      c.status !== "not-resolvable" &&
      (filterHostel === "All" || c.hostel === filterHostel)
  );

  return (
    <DashboardLayout
      menuItems={[
        { icon: "⚠️", label: "View Complaints", href: "/dashboard/staff" },
      ]}
      role="Staff"
      userName={user?.name || "Loading..."}
    >
      <div className="p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-muted rounded-lg transition">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-foreground">View Complaints</h2>
            <p className="text-muted-foreground mt-1">
              Track all facility complaints assigned to you
            </p>
          </div>
        </div>

        {/* Hostel Filter */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground">Filter by Hostel ID</label>
          <select
            value={filterHostel}
            onChange={(e) => setFilterHostel(e.target.value)}
            className="w-full mt-2 p-2 border border-border rounded bg-background text-foreground"
          >
            <option value="All">All</option>
            {[...new Set(complaints.map((c) => c.hostel))].map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading complaints…</p>
        ) : (
          <DataTable
            columns={[
              { key: "room", label: "Location", sortable: true },
              { key: "description", label: "Description", sortable: false },
              { key: "student", label: "Reported By", sortable: true },
              { key: "status", label: "Status", sortable: true },
            ]}
            data={visibleComplaints}   // ⭐ NOT-SOLVABLE REMOVED HERE
            actions={(row) => (
              <button
                onClick={() => {
                  setSelectedComplaint(row);
                  setNewStatus(
                    row.status === "in-progress" ||
                    row.status === "resolved" ||
                    row.status === "not-resolvable"
                      ? row.status
                      : "in-progress"
                  );
                  setUploadFile(null);
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition"
              >
                View Details
              </button>
            )}
          />
        )}

        {/* Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full">
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">Complaint Details</h3>
                <button onClick={() => setSelectedComplaint(null)} className="p-1 hover:bg-muted rounded transition">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Left side */}
                <div>
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="font-semibold text-foreground">{selectedComplaint.room}</p>

                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-semibold text-foreground">{selectedComplaint.description}</p>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">Reported By</p>
                    <p className="font-semibold text-foreground">{selectedComplaint.student}</p>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold text-foreground">{selectedComplaint.date}</p>
                  </div>
                </div>

                {/* Right side */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Student Image</p>
                    {selectedComplaint.imageUrl ? (
                      <img
                        src={selectedComplaint.imageUrl}
                        alt="student upload"
                        className="w-full max-h-52 object-cover rounded border"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">No image provided</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Upload photo (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="mt-2"
                    />
                    {uploadFile && <p className="text-sm mt-2">Selected: {uploadFile.name}</p>}
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <div className="mb-4">
                <label className="text-sm text-muted-foreground">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full mt-2 p-2 border border-border rounded bg-background text-foreground"
                >
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="not-resolvable">Not Resolvable</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleStatusChange}
                  disabled={updating}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-60"
                >
                  {updating ? "Updating..." : "Update Status"}
                </button>

                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition font-medium"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
