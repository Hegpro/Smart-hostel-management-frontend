"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import FormCard from "@/components/dashboard/form-card"
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

export default function RaiseComplaintPage() {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    usn: "",
    title: "",
    description: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student-complaints/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const result = await res.json()
      console.log("Complaint Created:", result)

      if (res.ok) {
        alert("Complaint Raised Successfully")
        setFormData({ usn: "", title: "", description: "" })
      } else {
        alert(result.message || "Error submitting complaint")
      }
    } catch (err) {
      console.error("Error submit complaint:", err)
    }
  }

  return (
    <DashboardLayout menuItems={menuItems} role="Warden" userName="Mr. Warden">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/warden" className="p-2 hover:bg-muted rounded-lg transition">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Raise Complaint</h2>
            <p className="text-muted-foreground mt-1">Report an issue for a student</p>
          </div>
        </div>

        <FormCard
          title="New Complaint"
          description="Fill all required details to raise a complaint for a student"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Student USN *</label>
            <input
              type="text"
              name="usn"
              value={formData.usn}
              onChange={handleChange}
              placeholder="eg: 2sd__"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief title of the complaint"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail"
              rows={5}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Submit Complaint
            </button>
            <Link
              href="/dashboard/warden"
              className="px-6 py-2 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition"
            >
              Cancel
            </Link>
          </div>
        </FormCard>
      </div>
    </DashboardLayout>
  )
}
