// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import DashboardLayout from "@/components/layout/dashboard-layout";
// import StatCard from "@/components/dashboard/stat-card";
// import { Users, AlertCircle, DoorOpen } from "lucide-react";
// import AddStaffModal from "@/components/auth/add-staff-modal";
// import CloseComplaintModal from "@/components/auth/close-complaint-modal";
// import ProtectedRoute from "@/components/auth/protected-route";
// import { getWardenDashboard } from "@/services/dashboardService";
// import api from "@/lib/api";

// const menuItems = [
//   { icon: <span>📊</span>, label: "Dashboard", href: "/dashboard/warden" },
//   { icon: <span>👥</span>, label: "Student List", href: "/dashboard/warden/students" },
//   { icon: <span>🏠</span>, label: "Room Management", href: "/dashboard/warden/rooms" },
//   { icon: <span>📋</span>, label: "View Complaints", href: "/dashboard/warden/complaints" },
// ];

// export default function WardenDashboard() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [data, setData] = useState<any>(null);

//   const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
//   const [isViewComplaintsOpen, setIsViewComplaintsOpen] = useState(false);
//   const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

//   const fetchData = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await getWardenDashboard();
//       // Backend should return an object with keys:
//       // studentCount, staffCount, roomStats, escalatedComplaints, recentComplaints, notices, complaintSummary
//       setData(res);
//     } catch (err: any) {
//       console.error("Warden dashboard fetch error:", err);
//       setError(err?.response?.data?.message || "Failed to load dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Close complaint (warden closes escalated complaint via backend route)
//   const handleCloseComplaint = async (reason: string) => {
//     if (!selectedComplaint) return;
//     try {
//       // call backend warden close route
//       await api.put(`/complaints/warden/close/${selectedComplaint._id}`, { note: reason });
//       // refresh
//       await fetchData();
//       setIsViewComplaintsOpen(false);
//       setSelectedComplaint(null);
//     } catch (err: any) {
//       console.error("Close complaint error:", err);
//       alert(err?.response?.data?.message || "Failed to close complaint");
//     }
//   };

//   if (loading) {
//     return (
//       <ProtectedRoute allowedRoles={["warden"]}>
//         <DashboardLayout menuItems={menuItems} role="Warden" userName="Warden">
//           <div className="p-8 text-center">Loading dashboard...</div>
//         </DashboardLayout>
//       </ProtectedRoute>
//     );
//   }

//   if (error) {
//     return (
//       <ProtectedRoute allowedRoles={["warden"]}>
//         <DashboardLayout menuItems={menuItems} role="Warden" userName="Warden">
//           <div className="p-8 text-center text-red-600">Error: {error}</div>
//         </DashboardLayout>
//       </ProtectedRoute>
//     );
//   }

//   // safe accessors with fallbacks
//   const studentCount = data?.studentCount ?? 0;
//   const staffCount = data?.staffCount ?? 0;
//   const assignedRooms = data?.roomStats?.assigned ?? data?.roomStats?.filled ?? 0;
//   const activeComplaints = data?.complaintSummary
//     ? data.complaintSummary.reduce((acc: number, s: any) => acc + (s._id === "pending" || s._id === "in-progress" ? s.count : 0), 0)
//     : (data?.activeComplaints ?? 0);
//   const escalatedCount = data?.escalatedComplaints ?? 0;
//   const recentComplaints = data?.recentComplaints ?? [];
//   const notices = data?.notices ?? [];

//   return (
//     <ProtectedRoute allowedRoles={["warden"]}>
//       <DashboardLayout menuItems={menuItems} role="Warden" userName={data?.user?.name || "Warden"}>
//         <div className="p-6 space-y-8">
//           <div>
//             <h2 className="text-3xl font-bold text-foreground">Welcome, {data?.user?.name ?? "Warden"}</h2>
//             <p className="text-muted-foreground mt-1">Manage your assigned block and students</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <StatCard
//               icon={<Users size={20} />}
//               title="Students Under Care"
//               value={String(studentCount)}
//               subtitle="Students in your hostel"
//               trend={{ value: 0, isPositive: true }}
//             />
//             <StatCard
//               icon={<DoorOpen size={20} />}
//               title="Assigned Rooms"
//               value={String(assignedRooms)}
//               subtitle="Rooms managed"
//               trend={{ value: 0, isPositive: true }}
//             />
//             <StatCard
//               icon={<AlertCircle size={20} />}
//               title="Active Complaints"
//               value={String(activeComplaints)}
//               subtitle="Open & in-progress"
//               trend={{ value: escalatedCount, isPositive: false }}
//             />
//           </div>

//           <div className="grid lg:grid-cols-2 gap-6">
//             {/* Add Staff Panel */}
//             <div className="bg-card border border-border rounded-lg p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-foreground">Add Staff</h3>
//                 <button
//                   onClick={() => setIsAddStaffOpen(true)}
//                   className="text-primary text-sm font-medium hover:underline"
//                 >
//                   Add
//                 </button>
//               </div>

//               <div className="space-y-3">
//                 {/* show a few latest staff or placeholder */}
//                 {(data?.recentStaff ?? []).slice(0, 3).map((s: any) => (
//                   <div key={s._id || s.id} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
//                     <div className="flex-1">
//                       <p className="font-medium text-foreground">{s.name}</p>
//                       <p className="text-sm text-muted-foreground">{s.staffType ?? "Staff"}</p>
//                     </div>
//                     <button className="text-primary hover:text-primary/80 transition text-sm font-medium">View</button>
//                   </div>
//                 ))}

//                 {(!data?.recentStaff || data.recentStaff.length === 0) && (
//                   <div className="text-sm text-muted-foreground">No staff added yet.</div>
//                 )}
//               </div>

//               <button
//                 onClick={() => setIsAddStaffOpen(true)}
//                 className="w-full mt-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium"
//                 data-testid="add-staff-btn"
//               >
//                 Add Staff Member
//               </button>
//             </div>

//             {/* Non-Resolvable / Escalated Complaints Summary */}
//             <div className="bg-card border border-border rounded-lg p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-foreground">Escalated / Non-Resolvable</h3>
//                 <button onClick={() => router.push("/dashboard/warden/complaints")} className="text-primary text-sm font-medium hover:underline">View all</button>
//               </div>

//               <div className="space-y-3">
//                 {recentComplaints.length === 0 && (
//                   <div className="text-sm text-muted-foreground">No escalated complaints</div>
//                 )}

//                 {recentComplaints.slice(0, 5).map((complaint: any) => (
//                   <div key={complaint._id || complaint.id} className="pb-3 border-b border-border last:border-0">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <p className="font-medium text-foreground">{complaint.title ?? complaint.description ?? "Complaint"}</p>
//                         <p className="text-sm text-muted-foreground">{complaint.createdBy?.name ?? complaint.createdBy?.usn ?? ""}</p>
//                         <p className="text-sm text-muted-foreground mt-1">{complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : ""}</p>
//                       </div>

//                       <div className="flex flex-col items-end gap-2">
//                         <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${complaint.status === "not-resolvable" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}>
//                           {complaint.status}
//                         </span>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => { setSelectedComplaint(complaint); setIsViewComplaintsOpen(true); }}
//                             className="text-sm text-primary hover:underline"
//                           >
//                             Close
//                           </button>
//                           <button
//                             onClick={() => router.push(`/dashboard/warden/complaints/${complaint._id}`)}
//                             className="text-sm text-muted-foreground hover:underline"
//                           >
//                             Details
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-card border border-border rounded-lg p-6">
//               <h3 className="text-lg font-semibold text-foreground mb-3">Manage Rooms</h3>
//               <p className="text-sm text-muted-foreground mb-4">View room assignments and availability.</p>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="p-3 bg-muted rounded">
//                   <p className="text-sm text-muted-foreground">Filled</p>
//                   <p className="font-medium">{data?.roomStats?.filled ?? 0}</p>
//                 </div>
//                 <div className="p-3 bg-muted rounded">
//                   <p className="text-sm text-muted-foreground">Empty</p>
//                   <p className="font-medium">{data?.roomStats?.empty ?? 0}</p>
//                 </div>
//               </div>

//               <button
//                 onClick={() => router.push("/dashboard/warden/rooms")}
//                 className="w-full mt-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold transition"
//               >
//                 Manage Rooms
//               </button>
//             </div>

//             <div className="bg-card border border-border rounded-lg p-6">
//               <h3 className="text-lg font-semibold text-foreground mb-3">Notices</h3>

//               <div className="space-y-3">
//                 {(notices ?? []).slice(0, 5).map((n: any) => (
//                   <div key={n._id || n.id} className="pb-3 border-b border-border last:border-0">
//                     <p className="font-medium text-foreground">{n.title}</p>
//                     <p className="text-sm text-muted-foreground">{n.message}</p>
//                     <p className="text-xs text-muted-foreground mt-1">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ""}</p>
//                   </div>
//                 ))}

//                 {(!notices || notices.length === 0) && <div className="text-sm text-muted-foreground">No notices available</div>}
//               </div>

//               <button onClick={() => router.push("/dashboard/warden/notices")} className="w-full mt-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium">View all notices</button>
//             </div>
//           </div>
//         </div>

//         <AddStaffModal
//           isOpen={isAddStaffOpen}
//           onClose={() => setIsAddStaffOpen(false)}
//           onSuccess={() => {
//             fetchData();
//             setIsAddStaffOpen(false);
//           }}
//         />
//         <CloseComplaintModal
//           isOpen={isViewComplaintsOpen}
//           onClose={() => { setIsViewComplaintsOpen(false); setSelectedComplaint(null); }}
//           complaintId={selectedComplaint?._id ?? ""}
//           onConfirm={handleCloseComplaint}
//         />
//       </DashboardLayout>
//     </ProtectedRoute>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import StatCard from "@/components/dashboard/stat-card";
import { Users, AlertCircle, DoorOpen } from "lucide-react";
import AddStaffModal from "@/components/auth/add-staff-modal";
import CloseComplaintModal from "@/components/auth/close-complaint-modal";
import ProtectedRoute from "@/components/auth/protected-route";
import { getWardenDashboard } from "@/services/dashboardService";
import api from "@/lib/api";

const menuItems = [
  { icon: <span>📊</span>, label: "Dashboard", href: "/dashboard/warden" },
  { icon: <span>👥</span>, label: "Student List", href: "/dashboard/warden/students" },
  { icon: <span>🛠️</span>, label: "Manage Staff", href: "/dashboard/warden/manage-staff" },
  { icon: <span>🏠</span>, label: "Room Management", href: "/dashboard/warden/rooms" },
  { icon: "⚠️", label: "Raise Complaint", href: "/dashboard/warden/raise-complaint" },
  { icon: <span>📋</span>, label: "View Complaints", href: "/dashboard/warden/complaints" },
];

export default function WardenDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isCloseComplaintOpen, setIsCloseComplaintOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getWardenDashboard();
      setData(res);
    } catch (err: any) {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute values from backend response
  const studentCount = data?.studentCount ?? 0;
  const staffCount = data?.staffCount ?? 0;
  const filledRooms = data?.roomStats?.filled ?? 0;

  const activeComplaints = data?.complaintSummary
    ? data.complaintSummary
      .filter((c: any) => c._id !== "closed")
      .reduce((sum: number, c: any) => sum + c.count, 0)
    : 0;

  const recentComplaints = data?.recentComplaints ?? [];
  const notices = data?.notices ?? [];

  // Warden closes complaint
  const handleCloseComplaint = async (note: string) => {
    if (!selectedComplaint) return;
    try {
      await api.put(`/complaints/warden/close/${selectedComplaint._id}`, { note });
      setIsCloseComplaintOpen(false);
      fetchData();
    } catch (e) {
      alert("Failed to close complaint");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["warden"]}>
      <DashboardLayout menuItems={menuItems} role="Warden" userName="Warden">
        <div className="p-6 space-y-8">

          <h2 className="text-3xl font-bold">Welcome, Warden</h2>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<Users size={20} />}
              title="Students Under Care"
              value={String(studentCount)}
              subtitle="Total students"
            />

            <StatCard
              icon={<DoorOpen size={20} />}
              title="Assigned Rooms"
              value={String(filledRooms)}
              subtitle="Occupied rooms"
            />

            <StatCard
              icon={<AlertCircle size={20} />}
              title="Total staffs"
              value={String(staffCount)}
              subtitle="Total staffs"
            />
          </div>

          {/* Non-Resolvable Complaints Panel */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Non-Resolvable Complaints
            </h3>

            <div className="space-y-3">
              {data?.recentComplaints?.filter((c: any) => c.status === "not-resolvable").length === 0 && (
                <p className="text-sm text-muted-foreground">No non-resolvable complaints</p>
              )}

              {data?.recentComplaints
                ?.filter((c: any) => c.status === "not-resolvable")
                ?.slice(0, 5)
                ?.map((c: any) => (
                  <div key={c._id} className="pb-3 border-b border-border last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {c.title || "Complaint"}
                        </p>
                        <p className="text-sm text-muted-foreground">{c.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(c.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {c.status}
                        </span>

                        <button
                          onClick={() => {
                            setSelectedComplaint(c);
                            setIsCloseComplaintOpen(true);
                          }}
                          className="text-primary text-sm hover:underline"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <button
              onClick={() => router.push("/dashboard/warden/complaints")}
              className="w-full mt-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium"
              data-testid="view-all-complaints-btn"
            >
              View All Closed Complaints
            </button>
          </div>


          {/* Notices */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Notices</h3>

            {notices.slice(0, 5).map((n: any) => (
              <div key={n._id} className="border-b border-border pb-3 mb-3">
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* MODALS */}
        <AddStaffModal
          isOpen={isAddStaffOpen}
          onClose={() => setIsAddStaffOpen(false)}
          onSuccess={() => fetchData()}
        />

        <CloseComplaintModal
          isOpen={isCloseComplaintOpen}
          onClose={() => setIsCloseComplaintOpen(false)}
          complaintId={selectedComplaint?._id}
          onConfirm={handleCloseComplaint}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
