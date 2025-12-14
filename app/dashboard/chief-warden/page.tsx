
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import ProtectedRoute from "@/components/auth/protected-route";
import { Trash2 } from "lucide-react";
import Link from "next/link";

const API_BASE =process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const HOSTEL_ID = "691e076ba2c5be3ba18a963d"; // change if needed

export default function ChiefWardenDashboard() {
  const router = useRouter();

  const [rooms, setRooms] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [roomStudents, setRoomStudents] = useState<any[]>([]);
  const [loadingRoomStudents, setLoadingRoomStudents] = useState(false);

  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  // initial load: rooms + notices
  useEffect(() => {
    let mounted = true;

    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API_BASE}/rooms/hostel/${HOSTEL_ID}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const text = await res.text();
        let json: any;
        try {
          json = JSON.parse(text);
        } catch {
          console.error("Rooms endpoint returned non-JSON:", text);
          json = null;
        }

        if (!res.ok) {
          console.error("Fetch rooms failed:", json || text);
          if (mounted) setRooms([]);
        } else {
          // accept json.rooms or json.data or json
          const list = (json && (json.rooms || json.data)) || json || [];
          if (mounted) setRooms(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error("Rooms fetch error:", err);
        if (mounted) setRooms([]);
      }
    };

    const fetchNotices = async () => {
      try {
        const res = await fetch(`${API_BASE}/notices/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const text = await res.text();
        let json: any;
        try {
          json = JSON.parse(text);
        } catch {
          console.error("Notices endpoint returned non-JSON:", text);
          json = null;
        }

        if (!res.ok) {
          console.error("Fetch notices failed:", json || text);
          if (mounted) setNotices([]);
        } else {
          const all = (json && (json.notices || json.data)) || json || [];
          const arr = Array.isArray(all) ? all : [];
          arr.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          if (mounted) setNotices(arr.slice(0, 4));
        }
      } catch (err) {
        console.error("Notices fetch error:", err);
        if (mounted) setNotices([]);
      }
    };

    (async () => {
      setLoading(true);
      await Promise.all([fetchRooms(), fetchNotices()]);
      if (mounted) setLoading(false);
    })();

    return () => { mounted = false; };
  }, []);

  // refresh rooms helper
  const refreshRooms = async () => {
    try {
      const res = await fetch(`${API_BASE}/rooms/hostel/${HOSTEL_ID}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const text = await res.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }

      if (!res.ok) {
        console.error("Refresh rooms failed:", json || text);
        return;
      }
      const list = (json && (json.rooms || json.data)) || json || [];
      setRooms(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Refresh rooms error:", err);
    }
  };

  // open room modal and fetch occupants
  const handleRoomClick = async (room: any) => {
    setSelectedRoom(room);
    setRoomStudents([]);
    setLoadingRoomStudents(true);

    try {
      const roomId = room._id || room.id;
      const res = await fetch(`${API_BASE}/auth/students/room/${roomId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const text = await res.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        console.error("Room students endpoint returned non-JSON:", text);
        json = null;
      }

      if (!res.ok) {
        console.error("Fetch room students failed:", json || text);
        setRoomStudents([]);
      } else {
        const list = (json && (json.students || json.data)) || json || [];
        setRoomStudents(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error("Room students fetch error:", err);
      setRoomStudents([]);
    } finally {
      setLoadingRoomStudents(false);
    }
  };

  // delete student handler with robust JSON parse
  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm("Remove this student from the room?")) return;

    setDeletingStudentId(studentId);
    try {
      const res = await fetch(`${API_BASE}/auth/remove/${studentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const text = await res.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        console.error("Delete endpoint returned non-JSON:", text);
        alert("Server returned an unexpected response. Check backend route or authentication.");
        return;
      }

      if (!res.ok) {
        alert(json.message || "Failed to remove student");
        return;
      }

      // success: refresh rooms and modal occupants
      await refreshRooms();
      if (selectedRoom) {
        // refetch occupants for selected room (find updated room object)
        const roomRef = rooms.find((r) => (r._id || r.id) === (selectedRoom._id || selectedRoom.id)) || selectedRoom;
        await handleRoomClick(roomRef);
      }
    } catch (err) {
      console.error("Delete student error:", err);
      alert("Server error while removing student");
    } finally {
      setDeletingStudentId(null);
    }
  };

  // redirect to add student (only allowed for non-full & non-maintenance)
  const handleAddStudent = (room: any) => {
    const roomId = room._id || room.id;
    const roomNumber = room.roomNumber || room.roomNo || room.number || "";
    router.push(`/dashboard/chief-warden/add-student?roomId=${encodeURIComponent(roomId)}&roomNumber=${encodeURIComponent(roomNumber)}`);
  };

  // reset academic year
  const handleResetAcademicYear = async () => {
    if (!confirm("This will reset the academic year for the hostel. Proceed?")) return;
    setResetting(true);
    try {
      const res = await fetch(`${API_BASE}/academic-year`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const text = await res.text();
      let json: any;
      try { json = JSON.parse(text); } catch { json = null; }

      if (!res.ok) {
        alert((json && json.message) || "Failed to reset academic year");
      } else {
        alert("Academic year reset successfully");
        await refreshRooms();
        // refresh notices too
        const nRes = await fetch(`${API_BASE}/notices/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const nText = await nRes.text();
        try {
          const nJson = JSON.parse(nText);
          const all = (nJson && (nJson.notices || nJson.data)) || nJson || [];
          const arr = Array.isArray(all) ? all : [];
          arr.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setNotices(arr.slice(0, 4));
        } catch {
          // ignore parse errors for notices refresh
        }
      }
    } catch (err) {
      console.error("Reset error:", err);
      alert("Server error while resetting");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["chiefWarden"]}>
        <DashboardLayout
          menuItems={[
            { icon: <span>📊</span>, label: "Dashboard", href: "/dashboard/chief-warden" },
            { icon: <span>➕</span>, label: "Add Student", href: "/dashboard/chief-warden/add-student" },
          ]}
          role="Chief Warden"
          userName="Chief Warden"
        >
          <div className="p-8 text-center">Loading...</div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["chiefWarden"]}>
      <DashboardLayout
        menuItems={[
          { icon: <span>📊</span>, label: "Dashboard", href: "/dashboard/chief-warden" },
          { icon: <span>👥</span>, label: "Manage Wardens", href: "/dashboard/chief-warden/manage-wardens" },
          { icon: <span>🛠️</span>, label: "View Complaints", href: "/dashboard/chief-warden/complaints" },
          { icon: "📢", label: "Upload Notice", href: "/dashboard/chief-warden/noticeupload" },
          { icon: "⚠️", label: "Student Complaints", href: "/dashboard/chief-warden/student-complaints" },
        ]}
        role="Chief Warden"
        userName="Chief Warden"
      >
        <div className="p-6 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Hostel Room Management</h2>
            <p className="text-muted-foreground mt-1">Click a room to view occupants or allocate students</p>
          </div>

          {/* Rooms box with Shalmala label */}
          <div className="bg-card border border-border rounded-lg p-6 relative">
            <div className="absolute right-4 top-4 text-sm font-medium text-muted-foreground">Shalmala</div>

            <h3 className="text-xl font-semibold text-foreground mb-4">Rooms</h3>

            {rooms.length === 0 ? (
              <p className="text-muted-foreground">No rooms found.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {rooms.map((r) => {
                  const occupantsCount = (r.occupants && r.occupants.length) || 0;
                  const capacity = r.capacity || 1;
                  const status = (r.status || "").toString().toLowerCase();

                  // statuses you provided: "available", "full", "maintenance"
                  const isFull = status === "full" || occupantsCount >= capacity;
                  const isMaintenance = status === "maintenance";
                  const isAvailableStatus = status === "available";
                  // partial: available status but occupants > 0
                  const isPartial = isAvailableStatus && occupantsCount > 0;
                  const isAvailable = isAvailableStatus && occupantsCount === 0;

                  const tileClass = isFull
                    ? "bg-red-50 border-red-200"
                    : isMaintenance
                      ? "bg-gray-50 border-gray-200"
                      : isPartial
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-green-50 border-green-200";

                  return (
                    <div
                      key={r._id || r.id}
                      onClick={() => handleRoomClick(r)}
                      className={`p-4 h-32 flex flex-col justify-between rounded-lg border cursor-pointer select-none transition hover:shadow-sm ${tileClass}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <p className="text-lg font-semibold text-foreground truncate">
                            {r.roomNumber || r.roomNo || r.number}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {r.roomType || r.roomTypeString || "—"} F0{r.floar}
                          </p>
                        </div>

                        <div className="ml-3 shrink-0">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isFull ? "bg-red-100 text-red-800" : isMaintenance ? "bg-gray-100 text-gray-800" : isPartial ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                            {isFull ? "F" : isMaintenance ? "M" : isPartial ? "P" : "A"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-muted-foreground">
                        {occupantsCount} occupant(s)
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500" />
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500" />
                <span className="text-sm text-muted-foreground">Partial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500" />
                <span className="text-sm text-muted-foreground">Full</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-500" />
                <span className="text-sm text-muted-foreground">Maintenance</span>
              </div>
            </div>
          </div>

          {/* Notices box */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-3">Latest Notices</h3>

            {notices.length === 0 ? (
              <p className="text-muted-foreground">No recent notices.</p>
            ) : (
              <div className="space-y-3">
                {notices.map((n) => (
                  <div key={n._id} className="p-3 border rounded-lg">
                    <p className="font-medium text-foreground">{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reset long centered button */}
          <div className="pt-6 flex justify-center">
            <button
              disabled={resetting}
              onClick={handleResetAcademicYear}
              className="w-full md:w-2/3 lg:w-1/2 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              {resetting ? "Resetting…" : "Reset Academic Year"}
            </button>
          </div>
        </div>

        {/* Modal */}
        {selectedRoom && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">
                  Room {selectedRoom.roomNumber || selectedRoom.roomNo || selectedRoom.number}
                </h3>
                <button onClick={() => setSelectedRoom(null)} className="text-muted-foreground">Close ✖</button>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-3">Occupants</h4>

                {loadingRoomStudents ? (
                  <p>Loading occupants…</p>
                ) : roomStudents.length === 0 ? (
                  <div className="p-4 rounded border text-center text-muted-foreground">No students in this room.</div>
                ) : (
                  <div className="space-y-3">
                    {roomStudents.map((s: any) => (
                      <div key={s._id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-semibold text-foreground">{s.name}</p>
                          <p className="text-sm text-muted-foreground">{s.usn}</p>
                        </div>
                        <div>
                          <button
                            disabled={deletingStudentId === s._id}
                            onClick={() => handleDeleteStudent(s._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Student / Block message */}
              <div className="mt-6">
                {selectedRoom.status === "maintenance" ? (
                  <div className="text-sm text-muted-foreground p-3 rounded border">This room is under maintenance and is blocked from allocation.</div>
                ) : ((roomStudents.length < (selectedRoom.capacity || 1)) ? (
                  <button
                    onClick={() => handleAddStudent(selectedRoom)}
                    className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Add Student
                  </button>
                ) : (
                  <div className="text-sm text-muted-foreground p-3 rounded border">Room is full. You can remove a student to free a slot.</div>
                ))}
              </div>

              <div className="mt-3">
                <button onClick={() => setSelectedRoom(null)} className="w-full py-2 border rounded-lg">Close</button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
