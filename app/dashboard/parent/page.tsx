// "use client";

// import { useEffect, useState } from "react";
// import DashboardLayout from "@/components/layout/dashboard-layout";
// import StatCard from "@/components/dashboard/stat-card";
// import { AlertCircle, CheckCircle, Clock } from "lucide-react";
// import Link from "next/link";
// import ProtectedRoute from "@/components/auth/protected-route";

// const menuItems = [
//   { icon: <span>📊</span>, label: "Dashboard", href: "/dashboard/parent" },
// ];

// export default function ParentDashboard() {
//   const [loading, setLoading] = useState(true);
//   const [student, setStudent] = useState<any>(null);
//   const [complaints, setComplaints] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchParentData = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/dashboard/parent`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         const data = await res.json();
//         console.log("Parent Dashboard Data:", data);

//         setStudent(data.student || null);
//         setComplaints(data.complaints || []);
//       } catch (err) {
//         console.error("Parent dashboard fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchParentData();
//   }, []);

//   if (loading) return <div className="p-6">Loading...</div>;

//   if (!student)
//     return (
//       <div className="p-6 text-center">
//         <p className="text-muted-foreground">No student linked to this parent.</p>
//       </div>
//     );

//   const pending = complaints.filter((c) => c.status === "Pending").length;
//   const inProgress = complaints.filter((c) => c.status === "In Progress").length;
//   const resolved = complaints.filter((c) => c.status === "Resolved").length;

//   return (
//     <ProtectedRoute allowedRoles={["parent"]}>
//       <DashboardLayout menuItems={menuItems} role="Parent" userName="Parent">
//         <div className="p-6 space-y-8">
//           {/* Header */}
//           <div>
//             <h2 className="text-3xl font-bold text-foreground">
//               Welcome, Parent
//             </h2>
//             <p className="text-muted-foreground mt-1">
//               Monitor your child's hostel details and complaints
//             </p>
//           </div>

//           {/* Student Box */}
//           <div className="bg-card border border-border rounded-lg p-6">
//             <h3 className="text-lg font-semibold text-foreground mb-3">
//               Student Details
//             </h3>

//             <p className="text-md font-medium text-foreground">
//               {student.name} ({student.usn})
//             </p>

//             <p className="text-sm text-muted-foreground mt-1">
//               Hostel: <span className="text-foreground">{student.hostel}</span>
//             </p>

//             <p className="text-sm text-muted-foreground">
//               Room: <span className="text-foreground">{student.roomNumber}</span>
//             </p>

//             {student.roommates?.length > 0 && (
//               <div className="mt-3">
//                 <p className="text-sm font-semibold text-foreground mb-1">
//                   Roommates:
//                 </p>
//                 <ul className="list-disc ml-5 text-sm text-muted-foreground">
//                   {student.roommates.map((r: any, index: number) => (
//                     <li key={index}>
//                       {r.name} ({r.usn})
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Stat Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <StatCard
//               icon={<AlertCircle size={24} />}
//               title="Pending Complaints"
//               value={pending}
//               subtitle="Awaiting action"
//             />
//             <StatCard
//               icon={<Clock size={24} />}
//               title="In Progress"
//               value={inProgress}
//               subtitle="Being resolved"
//             />
//             <StatCard
//               icon={<CheckCircle size={24} />}
//               title="Resolved"
//               value={resolved}
//               subtitle="Completed"
//             />
//           </div>

//           {/* Recent Complaints */}
//           <div className="bg-card border border-border rounded-lg p-6">
//             <h3 className="text-lg font-semibold text-foreground mb-4">
//               Recent Complaints
//             </h3>

//             {complaints.length === 0 && (
//               <p className="text-muted-foreground text-sm">
//                 No complaints available.
//               </p>
//             )}

//             <div className="space-y-4">
//               {complaints.slice(0, 4).map((c) => (
//                 <div
//                   key={c._id}
//                   className="flex items-start justify-between pb-4 border-b border-border last:border-0"
//                 >
//                   <div className="flex-1">
//                     <p className="font-medium text-foreground">{c.title}</p>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       {new Date(c.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         c.status === "Pending"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : c.status === "In Progress"
//                           ? "bg-blue-100 text-blue-800"
//                           : "bg-green-100 text-green-800"
//                       }`}
//                     >
//                       {c.status}
//                     </span>

//                     {c.priority && (
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           c.priority === "High"
//                             ? "bg-red-100 text-red-800"
//                             : "bg-orange-100 text-orange-800"
//                         }`}
//                       >
//                         {c.priority}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <Link
//               href="/dashboard/parent/complaints"
//               className="w-full mt-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium block text-center"
//             >
//               View All Complaints
//             </Link>
//           </div>
//         </div>
//       </DashboardLayout>
//     </ProtectedRoute>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import ProtectedRoute from "@/components/auth/protected-route";
import Link from "next/link";

const menuItems = [
  { icon: <span>📊</span>, label: "Dashboard", href: "/dashboard/parent" },
  { icon: <span>⚠️</span>, label: "View Complaints", href: "/dashboard/parent/complaints" },
];

export default function ParentDashboard() {
  const [student, setStudent] = useState<any>(null);
  const [studentComplaints, setStudentComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentComplaints = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student-complaints/parent`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      console.log("Parent Complaint API:", data);

      setStudent(data.student || null);
      setStudentComplaints(data.complaints || []);  // << correct field
    } catch (err) {
      console.error("Parent dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentComplaints();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <ProtectedRoute allowedRoles={["parent"]}>
      <DashboardLayout menuItems={menuItems} role="Parent" userName="Parent">
        <div className="p-6 space-y-6">

          {/* Title */}
          <h2 className="text-3xl font-bold">Parent Dashboard</h2>
          <p className="text-muted-foreground">
            View your child's behavioural / disciplinary reports
          </p>

          {/* --------------------------------------------------
               STUDENT INFO CARD
          -------------------------------------------------- */}
          {student && (
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Student Details</h3>

              <p className="text-sm"><span className="font-medium">Name:</span> {student.name}</p>
              <p className="text-sm"><span className="font-medium">USN:</span> {student.usn}</p>
              <p className="text-sm"><span className="font-medium">Hostel:</span> {student.hostel}</p>
              <p className="text-sm"><span className="font-medium">Room:</span> {student.room?.roomNumber}</p>

              {/* Roommates */}
              {student.room?.students?.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium mb-1">Roommates:</p>
                  <ul className="list-disc ml-5 text-sm">
                    {student.room.students.map((s: any) => (
                      <li key={s._id}>
                        {s.name} ({s.usn})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* --------------------------------------------------
               BEHAVIOURAL / DISCIPLINE COMPLAINTS
          -------------------------------------------------- */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm mt-6">
            <h3 className="text-xl font-semibold mb-4">Behavioural Complaints</h3>

            {studentComplaints.length === 0 ? (
              <p className="text-muted-foreground text-center py-3">
                No behavioural complaints recorded.
              </p>
            ) : (
              <div className="space-y-4">
                {studentComplaints.map((c) => (
                  <div
                    key={c._id}
                    className="p-4 border border-border rounded-lg bg-muted/30"
                  >
                    <p className="font-semibold text-foreground">
                      {c.title} — <span className="text-primary">{c.type}</span>
                    </p>

                    <p className="text-sm text-muted-foreground mt-1">
                      {c.description}
                    </p>

                    <p className="text-xs text-muted-foreground mt-2">
                      Status:{" "}
                      <span className="font-medium text-foreground">
                        {c.status}
                      </span>
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Issued By:{" "}
                      <span className="font-medium text-foreground">
                        {typeof c.issuedBy === "string"
                          ? c.issuedBy
                          : `${c.issuedBy?.name || ""} (${c.issuedBy?.role})`}
                      </span>
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Link
              href="/dashboard/parent/complaints"
              className="w-full mt-4 py-2 border border-primary text-primary rounded-lg block text-center hover:bg-primary/5"
            >
              View All Complaints
            </Link>
          </div>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

