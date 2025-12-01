"use client"

import DashboardLayout from "@/components/layout/dashboard-layout"
import RoomGrid from "@/components/dashboard/room-grid"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const menuItems = [
  { icon: "📊", label: "Dashboard", href: "/dashboard/warden" },
  { icon: "👥", label: "Student List", href: "/dashboard/warden/students" },
  { icon: "🏠", label: "Room Management", href: "/dashboard/warden/rooms" },
   { icon: <span>🛠️</span>, label: "Manage Staff", href: "/dashboard/warden/manage-staff" },
  { icon: "⚠️", label: "Raise Complaint", href: "/dashboard/warden/raise-complaint" },
  { icon: "📢", label: "Upload Notice", href: "/dashboard/warden/upload-notice" },
  { icon: "📋", label: "View Complaints", href: "/dashboard/warden/complaints" },
]

const roomData = [
  { number: "101", capacity: "2", occupied: "2", students: "John Doe, Mike Lee", status: "Full" },
  { number: "102", capacity: "2", occupied: "1", students: "Jane Smith", status: "Available" },
  { number: "103", capacity: "2", occupied: "2", students: "Bob Wilson, Tom Brown", status: "Full" },
  { number: "104", capacity: "2", occupied: "0", students: "-", status: "Empty" },
  { number: "105", capacity: "2", occupied: "2", students: "Alice Brown, Sarah Davis", status: "Full" },
]

export default function WardenRoomsPage() {
  return (
    <DashboardLayout menuItems={menuItems} role="Warden" userName="Mr. Warden">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/warden" className="p-2 hover:bg-muted rounded-lg transition">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h3 className="text-3xl font-bold text-foreground">Room Management</h3>
            <p className="text-muted-foreground mt-1">View and manage room assignments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-4 border border-border bg-card rounded-lg">
          <div className="text-primary font-semibold">ℹ️</div>
          <p className="text-primary font-semibold">Read-Only View – Managed by Chief Warden</p>
        </div>

        <RoomGrid isEditable={false} gridSize={16} />

        {/* Original room data grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomData.map((room) => (
            <div key={room.number} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Room Number</p>
                  <p className="text-2xl font-bold text-foreground">{room.number}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    room.status === "Full"
                      ? "bg-red-100 text-red-800"
                      : room.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {room.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Occupancy</p>
                  <p className="font-semibold text-foreground">
                    {room.occupied} / {room.capacity}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="text-sm text-foreground">{room.students}</p>
                </div>
              </div>

              {room.status === "Empty" && (
                <button className="w-full py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium text-sm">
                  Block Room — Maintenance
                </button>
              )}

              {room.status !== "Empty" && (
                <div className="w-full py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium text-sm flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Restricted Access</span>
                </div>
              )}

              <button className="w-full py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium text-sm mt-2">
                Manage Room
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
