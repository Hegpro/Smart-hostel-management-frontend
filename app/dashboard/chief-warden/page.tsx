"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import StatCard from "@/components/dashboard/stat-card"
import { UserCheck, AlertCircle, Home } from "lucide-react"
import RoomGrid from "@/components/dashboard/room-grid"
import ProtectedRoute from "@/components/auth/protected-route"
import { getChiefDashboard } from "@/services/dashboardService"  // <-- added

const menuItems = [
  { icon: <span>📊</span>, label: "Dashboard", href: "/dashboard/chief-warden" },
  { icon: <span>➕</span>, label: "Add Student", href: "/dashboard/chief-warden/add-student" },
  { icon: <span>👥</span>, label: "Manage Wardens", href: "/dashboard/chief-warden/manage-wardens" },
  { icon: <span>⚠️</span>, label: "View Complaints", href: "/dashboard/chief-warden/complaints" },
  { icon: <span>📈</span>, label: "Reports", href: "/dashboard/chief-warden/reports" },
]

export default function ChiefWardenDashboard() {
  const router = useRouter()

  const [dashboardData, setDashboardData] = useState<any>(null)   // <-- added
  const [loading, setLoading] = useState(true)                   // <-- added
  const [hostelFilter, setHostelFilter] = useState("All")

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getChiefDashboard()
        console.log("Dashboard Data:", data)
        setDashboardData(data)
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleManageRooms = () => router.push("/dashboard/chief-warden/rooms")
  const handleResetData = () => {}

  // ⭐ Loading state
  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>

  return (
    <ProtectedRoute allowedRoles={["chiefWarden"]}>
      <DashboardLayout menuItems={menuItems} role="Chief Warden" userName="Dr. Satish">
        <div className="p-6 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Welcome, Chief Warden</h2>
            <p className="text-muted-foreground mt-1">Manage your hostel operations and monitor all activities</p>
          </div>

          {/* ⭐ Stat Cards pulling backend values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<span>👥</span>}
              title="Total Students"
              value={dashboardData?.totalStudents}
              subtitle="Active residents"
              // trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              icon={<UserCheck size={24} />}
              title="Total Wardens"
              value={dashboardData?.totalWardens}
              subtitle="All hostel blocks"
              // trend={{ value: 0, isPositive: true }}
            />
            <StatCard
              icon={<Home size={24} />}
              title="Room Occupancy"
              value={`${dashboardData?.roomStats?.filledPercentage || 0}%`}
              subtitle="Rooms filled"
              // trend={{ value: 5, isPositive: true }}
            />
          </div>

          {/* ⭐ Recent Students */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Students</h3>
              <div className="space-y-3">
                {dashboardData?.recentStudents?.slice(0, 3)?.map((student: any) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.usn} • Room {student.room}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium">
                View All Students
              </button>
            </div>
          </div>

          {/* Room Grid Section */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Hostel Room Allocation</h3>
              <p className="text-muted-foreground">Theater-style room layout with Left Wing and Right Wing</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-foreground">Filter by Hostel:</label>
                <select
                  value={hostelFilter}
                  onChange={(e) => setHostelFilter(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg text-sm text-foreground"
                >
                  <option value="All">Shalmala</option>
                  <option value="Left Wing">abc</option>
                  <option value="Right Wing">xyz</option>
                </select>
              </div>

              <RoomGrid filter={hostelFilter} />
            </div>

            <button
              onClick={handleManageRooms}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold transition"
            >
              Manage Rooms (Full Grid)
            </button>

            <button
              onClick={handleResetData}
              className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition"
            >
              Reset Data
            </button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
// Note: The getChiefDashboard function is assumed to be defined in the dashboardService file to fetch data from the backend.