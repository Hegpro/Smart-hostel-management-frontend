"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import FormCard from "@/components/dashboard/form-card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/dashboard/image-upload";
import ProtectedRoute from "@/components/auth/protected-route";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const menuItems = [
  { icon: <span>📊</span>, label: "Dashboard", href: "/dashboard/student" },
  { icon: <span>⚠️</span>, label: "Submit Complaint", href: "/dashboard/student/complaint" },
  { icon: <span>📋</span>, label: "Complaint Status", href: "/dashboard/student/complaints" },
];

export default function ComplaintPage() {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    image: null as File | null,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (image: File | null) => {
    setFormData((prev) => ({ ...prev, image }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.description) {
      alert("All fields are required");
      return;
    }

    setSubmitting(true);

    try {
      const body = new FormData();
      body.append("title", "Complaint");
      body.append("category", formData.category);
      body.append("description", formData.description);

      if (formData.image) {
        body.append("image", formData.image);
      }

      const res = await fetch(`${BASE_URL}/complaints/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to submit complaint");
        return;
      }

      alert("Complaint submitted successfully!");
      window.location.href = "/dashboard/student/complaints";

    } catch (err) {
      console.error("COMPLAINT ERROR:", err);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DashboardLayout menuItems={menuItems} role="Student" userName="Student">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/student"
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </Link>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Submit Complaint</h2>
              <p className="text-muted-foreground mt-1">
                Report an issue or concern
              </p>
            </div>
          </div>

          <FormCard
            title="New Complaint"
            description="Describe your issue and we will help you resolve it"
            onSubmit={handleSubmit}
          >
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                required
              >
                <option value="">Select Category</option>
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
                <option value="cleaner">Cleaner</option>
                <option value="room-boy">Room Boy</option>
                <option value="carpenter">Carpenter</option>
                <option value="civil">Civil</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your issue in detail"
                rows={6}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Upload Image
              </label>
              <ImageUpload
                onImageChange={handleImageChange}
                accept="image/jpeg, image/png"
                maxSize={5 * 1024 * 1024}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
              <Link
                href="/dashboard/student"
                className="px-6 py-2 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition"
              >
                Cancel
              </Link>
            </div>
          </FormCard>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
