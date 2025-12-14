"use client";

export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import FormCard from "@/components/dashboard/form-card";
import AccountCreatedModal from "@/components/auth/account-created-modal";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { icon: <span>📊</span>, label: "Dashboard", href: "/dashboard/chief-warden" },
  { icon: <span>➕</span>, label: "Add Student", href: "/dashboard/chief-warden/add-student" },
];

export default function AddStudentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomNumberFromURL = searchParams.get("roomNumber") || "";
  const roomIdFromURL = searchParams.get("roomId") || "";

  const [formData, setFormData] = useState({
    usn: "",
    name: "",
    email: "",
    phone: "",
    room: roomNumberFromURL, // auto-filled
    roomId: roomIdFromURL,   // hidden field for backend
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


  // Handle input change
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Submit to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${BASE_URL}/auth/chief/student`,  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        alert("Server returned invalid response");
        return;
      }

      if (!res.ok) {
        setErrors(data.errors || { general: data.message || "Failed to add student" });
        return;
      }

      // SUCCESS → show modal
      setGeneratedPassword(data.studentPassword);
      setGeneratedUsername(formData.usn);

      setShowPasswordModal(true);

      // Clear form
      setFormData({
        usn: "",
        name: "",
        email: "",
        phone: "",
        room: roomNumberFromURL, // keep prefilled
        roomId: roomIdFromURL,
      });

    } catch (err) {
      console.error(err);
      setErrors({ general: "Network error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} role="Chief Warden" userName="Dr. Admin">
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/chief-warden" className="p-2 hover:bg-muted rounded-lg transition">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Add New Student</h2>
            <p className="text-muted-foreground mt-1">Register a new hostel resident</p>
          </div>
        </div>

        {/* FORM */}
        <FormCard
          title="Student Information"
          description="Enter the student's details and room assignment"
          onSubmit={handleSubmit}
        >
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium mb-2">USN</label>
              <input
                type="text"
                name="usn"
                value={formData.usn}
                onChange={handleChange}
                placeholder="e.g., USN001"
                className="w-full px-4 py-2 bg-input border rounded-lg"
                required
              />
              {errors.usn && <p className="text-red-500 text-xs">{errors.usn}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., John Doe"
                className="w-full px-4 py-2 bg-input border rounded-lg"
                required
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., john@example.com"
                className="w-full px-4 py-2 bg-input border rounded-lg"
                required
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., 9876543210"
                className="w-full px-4 py-2 bg-input border rounded-lg"
                required
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>

            {/* Prefilled Room Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Room Number</label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                readOnly
                className="w-full px-4 py-2 bg-muted border rounded-lg text-foreground cursor-not-allowed"
              />
            </div>

          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? "Adding..." : "Add Student"}
            </button>

            <Link
              href="/dashboard/chief-warden"
              className="px-6 py-2 border rounded-lg font-semibold hover:bg-muted"
            >
              Cancel
            </Link>
          </div>
        </FormCard>
      </div>

      {/* SUCCESS MODAL */}
      <AccountCreatedModal
        isOpen={showPasswordModal}
        title="Student Created Successfully"
        username={generatedUsername}     // NEW
        password={generatedPassword}     // From backend
        isStub={false}
        onClose={() => {
          setShowPasswordModal(false);
          router.push("/dashboard/chief-warden");
        }}
      />
    </DashboardLayout>
  );
}