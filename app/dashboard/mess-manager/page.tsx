"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import FormCard from "@/components/dashboard/form-card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/protected-route";

const menuItems = [
  { icon: "📊", label: "Dashboard", href: "/dashboard/mess-manager" },
  // { icon: "➕", label: "Add Surplus Food", href: "/dashboard/mess-manager/add-surplus" },
  { icon: "📦", label: "Manage Distribution", href: "/dashboard/mess-manager/manage" },
  { icon: "👥", label: "View NGOs", href: "/dashboard/mess-manager/ngos" },
];


export default function AddSurplusPage() {
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    unit: "kg",
    expiryDate: "",
    expiryHour: "1",
    expiryMinute: "00",
    expiryPeriod: "AM",
    description: "",
  });

  function toISODate(date: string, hour: string, minute: string, period: string) {
    if (!date) return ""; // prevents invalid date error

    let h = parseInt(hour, 10);

    if (period === "PM" && h < 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    const isoString = new Date(`${date}T${h.toString().padStart(2, "0")}:${minute}:00`).toISOString();
    return isoString;
  }


  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!formData.expiryDate) {
      alert("Please select a valid expiry date");
      return;
    }

    const deadlineISO = toISODate(
      formData.expiryDate,
      formData.expiryHour,
      formData.expiryMinute,
      formData.expiryPeriod
    );

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surplus/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.itemName,
          description: formData.description,
          quantity: `${formData.quantity} ${formData.unit}`,
          deadline: deadlineISO,
        }),
      });

      if (res.ok) {
        alert("Surplus food added successfully!");
      } else {
        const errData = await res.json();
        alert(errData.message || "Error adding surplus");
      }
    } catch (err) {
      alert("Server connection failed");
    }
  };
  // const [success, setSuccess] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surplus/create`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       body: JSON.stringify({
  //         itemName: formData.itemName,
  //         quantity: formData.quantity,
  //         unit: formData.unit,
  //         expiryDate: formData.expiryDate,
  //         description: formData.description,
  //       }),
  //     });

  //     if (!response.ok) {
  //       const data = await response.json();
  //       throw new Error(data.message || "Failed to add surplus");
  //     }

  //     setSuccess("Surplus Added Successfully");

  //     // Reset form after submit
  //     setFormData({
  //       itemName: "",
  //       quantity: "",
  //       unit: "kg",
  //       expiryDate: "",
  //       expiryHour: "",
  //       expiryMinute: "",
  //       expiryPeriod: "",
  //       description: "",
  //     });

  //   } catch (error: any) {
  //     console.error("Add surplus error:", error);
  //     setError(error.message);
  //   }
  // };




  return (
    <ProtectedRoute allowedRoles={["messManager"]}>
      <DashboardLayout menuItems={menuItems} role="Mess Manager" userName="Mess Manager">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/mess-manager" className="p-2 hover:bg-muted rounded-lg transition">
              <ArrowLeft size={24} className="text-foreground" />
            </Link>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Add Surplus Food</h2>
              <p className="text-muted-foreground mt-1">Log new surplus food items</p>
            </div>
          </div>

          <FormCard title="Food Surplus Details" description="Enter details of the surplus food items" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Item Name</label>
                  <input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg"
                      required
                    />
                  </div>
                  <div className="pt-8">
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="px-4 py-2 bg-input border border-border rounded-lg"
                    >
                      <option value="kg">kg</option>
                      <option value="ltr">ltr</option>
                      <option value="pcs">pcs</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Expiry Date & Time</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg mb-3"
                  required
                />

                <div className="flex gap-2">
                  <select name="expiryHour" value={formData.expiryHour} onChange={handleChange} className="border rounded-md px-2 py-2">
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1}>{i + 1}</option>
                    ))}
                  </select>

                  <select name="expiryMinute" value={formData.expiryMinute} onChange={handleChange} className="border rounded-md px-2 py-2">
                    {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>

                  <select name="expiryPeriod" value={formData.expiryPeriod} onChange={handleChange} className="border rounded-md px-2 py-2">
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg"
                />
              </div>

              {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
              {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-lg font-semibold">
                  {loading ? "Submitting..." : "Add Surplus Food"}
                </button>
                <Link href="/dashboard/mess-manager" className="px-6 py-2 border rounded-lg">
                  Cancel
                </Link>
              </div>
            </div>
          </FormCard>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
