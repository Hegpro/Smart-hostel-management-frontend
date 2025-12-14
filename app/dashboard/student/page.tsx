"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import ProtectedRoute from "@/components/auth/protected-route";
import { Users, MapPin } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      const res = await fetch(`${API}/dashboard/student`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-foreground">Loading dashboard…</div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load dashboard
      </div>
    );
  }

  const { student, hostel, room, roommates, notices } = data;

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DashboardLayout
        menuItems={[
          { icon: <span>📊</span>, label: "Dashboard", href: "/dashboard/student" },
          // { icon: <span>🏠</span>, label: "Room Details", href: "/dashboard/student/room" },
          { icon: <span>⚠️</span>, label: "Submit Complaint", href: "/dashboard/student/complaint" },
          { icon: <span>📋</span>, label: "Complaint Status", href: "/dashboard/student/complaints" },
        ]}
        role="Student"
        userName={student.name}
      >
        <div className="p-6 space-y-10">

          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Welcome, {student.name}
            </h2>
            <p className="text-muted-foreground mt-1">
              Manage your hostel account
            </p>
          </div>

          {/* Room & Student Info */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Room Details */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Room Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="text-primary mt-1" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">Room Number</p>
                    <p className="font-semibold text-foreground text-lg">
                      {room.roomNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="text-primary mt-1" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Hostel / Floor
                    </p>
                    <p className="font-semibold text-foreground">
                      {hostel.name} • Floor {room.floor}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Users className="text-primary mt-1" size={20} />
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-semibold text-foreground">
                      {room.capacity} Students
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Roommates */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Roommates
              </h3>

              {roommates.length === 0 ? (
                <p className="text-muted-foreground text-sm">No roommates</p>
              ) : (
                roommates.map((mate: any) => (
                  <div
                    key={mate._id}
                    className="flex items-center gap-4 pb-6 border-b border-border last:border-none last:pb-0"
                  >
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                      {mate.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{mate.name}</p>
                      <p className="text-sm text-muted-foreground">{mate.usn}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notices */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Latest Notices
            </h3>

            {notices.length === 0 ? (
              <p className="text-muted-foreground text-sm">No notices available.</p>
            ) : (
              <div className="space-y-4">
                {notices.map((n: any) => (
                  <div
                    key={n._id}
                    className="bg-card border border-border p-4 rounded-lg"
                  >
                    <p className="text-lg font-medium text-foreground">{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{n.message}</p>

                    {n.imageUrl && (
                      <img
                        src={n.imageUrl}
                        alt="notice"
                        className="mt-3 rounded border max-h-48 object-cover"
                      />
                    )}

                    <p className="text-xs text-muted-foreground mt-2">
                      Posted by {n.postedRole} •{" "}
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
