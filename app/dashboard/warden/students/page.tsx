"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import DataTable from "@/components/dashboard/data-table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { icon: "📊", label: "Dashboard", href: "/dashboard/warden" },
  { icon: "👥", label: "Student List", href: "/dashboard/warden/students" },
  { icon: "🏠", label: "Room Management", href: "/dashboard/warden/rooms" },
  { icon: <span>🛠️</span>, label: "Manage Staff", href: "/dashboard/warden/manage-staff" },
  { icon: "⚠️", label: "Raise Complaint", href: "/dashboard/warden/raise-complaint" },
  { icon: "📢", label: "Upload Notice", href: "/dashboard/warden/upload-notice" },
  { icon: "📋", label: "View Complaints", href: "/dashboard/warden/complaints" },
];

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/warden/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setStudents(data.students || []);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <div className="p-6 text-center text-lg">Loading students...</div>;

  return (
    <DashboardLayout menuItems={menuItems} role="Warden" userName="Mr. Warden">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/warden" className="p-2 hover:bg-muted rounded-lg transition">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Student List</h2>
            <p className="text-muted-foreground mt-1">Manage all students under your care</p>
          </div>
        </div>

        <DataTable
          columns={[
            { key: "name", label: "Name", sortable: false },
            { key: "usn", label: "USN", sortable: false },
            { key: "phone", label: "Phone", sortable: false },
            { key: "email", label: "Email", sortable: false },
            { key: "room", label: "Room", sortable: true },   // FIXED HERE
          ]}
          data={students.map((s) => ({
            ...s,
            room: s.roomId?.roomNumber ?? "Not Assigned",
          }))}
        />
      </div>
    </DashboardLayout>
  );
}
