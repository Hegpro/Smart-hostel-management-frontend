// "use client"

// import ProtectedRoute from "@/components/auth/protected-route"
// import DashboardLayout from "@/components/layout/dashboard-layout"
// import AddStaffModal from "@/components/auth/add-staff-modal"
// import { useState, useEffect } from "react"

// export default function ManageStaffPage() {
//     const [staffList, setStaffList] = useState<any[]>([])
//     const [isAddStaffOpen, setIsAddStaffOpen] = useState(false)

//     const fetchStaff = async () => {
//         try {
//             const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//             console.log("TOKEN USED:", token);

//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/warden/staff`, {
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                 },
//             });

//             const data = await res.json();
//             console.log("API Response:", data);

//             setStaffList(data.staff || []);
//         } catch (err) {
//             console.log("Error fetching staff:", err);
//         }
//     };




//     useEffect(() => {
//         fetchStaff()
//     }, [])

//     return (
//         <ProtectedRoute allowedRoles={["warden"]}>
//             <DashboardLayout
//                 role="Warden"
//                 userName="Mr. Warden"
//                 menuItems={[
//                     { icon: <span>📊</span>, label: "Dashboard", href: "/dashboard/warden" },
//                     { icon: <span>👥</span>, label: "Student List", href: "/dashboard/warden/students" },
//                     { icon: <span>🏠</span>, label: "Room Management", href: "/dashboard/warden/rooms" },
//                     { icon: <span>🛠️</span>, label: "Manage Staff", href: "/dashboard/warden/manage-staff" },
//                     { icon: <span>📋</span>, label: "View Complaints", href: "/dashboard/warden/complaints" },
//                 ]}
//             >
//                 <div className="p-6 space-y-6">
//                     {/* Header */}
//                     <div className="flex justify-between items-center">
//                         <h2 className="text-3xl font-bold text-foreground">Manage Staff</h2>
//                         <button
//                             onClick={() => setIsAddStaffOpen(true)}
//                             className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
//                         >
//                             + Add Staff
//                         </button>
//                     </div>

//                     {/* Staff List Container */}
//                     <div className="bg-card border border-border rounded-lg p-6 space-y-4">
//                         <h3 className="text-lg font-semibold text-foreground mb-2">Staff Members</h3>

//                         {staffList.length === 0 && (
//                             <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
//                                 No staff added yet.
//                             </div>
//                         )}

//                         <div className="space-y-3">
//                             {staffList.map((staff) => (
//                                 <div
//                                     key={staff._id}
//                                     className="flex justify-between items-center p-4 bg-muted/30 border border-border rounded-lg"
//                                 >
//                                     <div>
//                                         <p className="font-medium text-foreground text-lg">{staff.name}</p>
//                                         <p className="text-sm text-muted-foreground">{staff.email}</p>
//                                     </div>

//                                     <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
//                                         {staff.staffType}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Modal */}
//                 <AddStaffModal
//                     isOpen={isAddStaffOpen}
//                     onClose={() => setIsAddStaffOpen(false)}
//                     onSuccess={fetchStaff}
//                 />
//             </DashboardLayout>
//         </ProtectedRoute>
//     )
// }
"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import DashboardLayout from "@/components/layout/dashboard-layout";
import AddStaffModal from "@/components/auth/add-staff-modal";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react"; // delete icon

export default function ManageStaffPage() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  const fetchStaff = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      console.log("TOKEN USED:", token);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/warden/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("API Response:", data);

      setStaffList(data.staff || []);
    } catch (err) {
      console.log("Error fetching staff:", err);
    }
  };

  const deleteStaff = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this staff?");
    if (!confirmed) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/warden/staff/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setStaffList((prev) => prev.filter((staff) => staff._id !== id)); // remove without page refresh
      } else {
        console.log("Delete failed");
      }
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["warden"]}>
      <DashboardLayout
        role="Warden"
        userName="Mr. Warden"
        menuItems={[
          { icon: <span>📊</span>, label: "Dashboard", href: "/dashboard/warden" },
          { icon: <span>👥</span>, label: "Student List", href: "/dashboard/warden/students" },
          { icon: <span>🏠</span>, label: "Room Management", href: "/dashboard/warden/rooms" },
          { icon: <span>🛠️</span>, label: "Manage Staff", href: "/dashboard/warden/manage-staff" },
          { icon: "⚠️", label: "Raise Complaint", href: "/dashboard/warden/raise-complaint" },
          { icon: "📢", label: "Upload Notice", href: "/dashboard/warden/upload-notice" },
          { icon: <span>📋</span>, label: "View Complaints", href: "/dashboard/warden/complaints" },
        ]}
      >
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-foreground">Manage Staff</h2>
            <button
              onClick={() => setIsAddStaffOpen(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
            >
              + Add Staff
            </button>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Staff Members</h3>

            {staffList.length === 0 && (
              <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
                No staff added yet.
              </div>
            )}

            <div className="space-y-3">
              {staffList.map((staff) => (
                <div
                  key={staff._id}
                  className="flex justify-between items-center p-4 bg-muted/30 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground text-lg">{staff.name}</p>
                    <p className="text-sm text-muted-foreground">{staff.email || "No email"}</p>
                    <p className="text-sm text-muted-foreground">+91 {staff.phone}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap capitalize">
                      {staff.staffType}
                    </span>

                    <button
                      onClick={() => deleteStaff(staff._id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      aria-label="Delete Staff"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AddStaffModal
          isOpen={isAddStaffOpen}
          onClose={() => setIsAddStaffOpen(false)}
          onSuccess={fetchStaff}
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
