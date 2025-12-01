"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const menuItems = [
  { icon: "📊", label: "Dashboard", href: "/dashboard/warden" },
  { icon: "👥", label: "Student List", href: "/dashboard/warden/students" },
  { icon: "🏠", label: "Room Management", href: "/dashboard/warden/rooms" },
  { icon: <span>🛠️</span>, label: "Manage Staff", href: "/dashboard/warden/manage-staff" },
  { icon: "⚠️", label: "Raise Complaint", href: "/dashboard/warden/raise-complaint" },
  { icon: "📢", label: "Upload Notice", href: "/dashboard/warden/upload-notice" },
  { icon: "📋", label: "view Complaints", href: "/dashboard/warden/closed-complaints" },
]

export default function ClosedComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchClosedComplaints = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/complaints/warden/closed`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await res.json()
      setComplaints(data.complaints || [])
    } catch (err) {
      console.error("Error fetching closed complaints:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClosedComplaints()
  }, [])

  if (loading) return <div className="p-6">Loading closed complaints...</div>

  return (
    <DashboardLayout menuItems={menuItems} role="Warden" userName="Mr. Warden">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/warden" className="p-2 hover:bg-muted rounded-lg transition">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Closed Complaints</h2>
            <p className="text-muted-foreground mt-1">Resolved complaints history</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          {complaints.length === 0 && (
            <p className="text-muted-foreground text-center p-4">No closed complaints available.</p>
          )}

          {complaints.map((c) => (
            <div
              key={c._id}
              className="p-4 border rounded-lg bg-muted/30 flex flex-col gap-2"
            >
              <h3 className="text-lg font-semibold text-foreground">{c.title}</h3>

              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Student:</span> {c.createdBy?.name} • Room{" "}
                {c.createdBy?.roomId?.roomNumber || "N/A"}
              </p>

              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Category:</span> {c.category}
              </p>

              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span>{" "}
                {c.wardenNote|| "Solved"}
              </p>

              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Handled By:</span>{" "}
                {c.handledBy?.name} ({c.handledBy?.staffType})
              </p>

              <p className="text-xs text-muted-foreground italic">
                Closed on {new Date(c.updatedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
