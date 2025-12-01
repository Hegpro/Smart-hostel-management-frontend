"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import ProtectedRoute from "@/components/auth/protected-route"
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

export default function UploadNoticePage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    image: null as File | null,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleChange = (e: any) => {
    const { name, value, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      const fd = new FormData()
      fd.append("title", formData.title)
      fd.append("message", formData.message)
      if (formData.image) fd.append("image", formData.image)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notices/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      })

      if (res.ok) {
        setSuccess(true)
        setFormData({ title: "", message: "", image: null })
        setMessage("Notice uploaded successfully!")
      } else {
        setMessage("Failed to upload notice")
      }
    } catch (err) {
      console.log(err)
      setMessage("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["warden", "chiefWarden"]}>
      <DashboardLayout menuItems={menuItems} role="Warden" userName="Mr. Warden">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/warden" className="p-2 hover:bg-muted rounded-lg transition">
              <ArrowLeft size={24} className="text-foreground" />
            </Link>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Upload Notice</h2>
              <p className="text-muted-foreground mt-1">Post announcements to students</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-lg p-6 space-y-4 max-w-2xl"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Notice Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Upload Image (optional)</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-sm"
              />
            </div>

            {message && (
              <p className="text-center text-sm text-primary font-medium">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              {loading ? "Uploading..." : "Upload Notice"}
            </button>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
