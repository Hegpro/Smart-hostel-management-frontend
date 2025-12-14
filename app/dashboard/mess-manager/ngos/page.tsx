"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import DataTable from "@/components/dashboard/data-table";
import { ArrowLeft, X, Trash2 } from "lucide-react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL||"http://localhost:5000/api";

const menuItems = [
  { icon: "📊", label: "Dashboard", href: "/dashboard/mess-manager" },
  { icon: "📦", label: "Manage Distribution", href: "/dashboard/mess-manager/manage" },
  { icon: "👥", label: "View NGOs", href: "/dashboard/mess-manager/ngos" },
];

export default function NgosPage() {
  const [ngos, setNgos] = useState<any[]>([]);
  const [selectedNgo, setSelectedNgo] = useState<any | null>(null);
  const [ngoStatus, setNgoStatus] = useState("");

  const getNgos = async () => {
    try {
      const res = await fetch(`${BASE_URL}/surplus/ngos/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await res.json();
      setNgos((data.ngos || []).map((i: any) => ({ ...i, id: i._id })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getNgos();
  }, []);

  const deleteNgo = async (ngoId: string) => {
    if (!confirm("Are you sure you want to delete this NGO?")) return;

    try {
      const res = await fetch(`${BASE_URL}/surplus/ngos/${ngoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await res.json();

      if (!res.ok) return alert(data.message);
      alert("NGO deleted successfully");

      getNgos();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} role="Mess Manager" userName="Manager">
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/mess-manager" className="p-2 hover:bg-muted rounded-lg transition">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-foreground">NGO Partners</h2>
            <p className="text-muted-foreground mt-1">Manage NGO organizations receiving food surplus</p>
          </div>
        </div>

        {/* TABLE WITHOUT STATUS COLUMN */}
        <DataTable
          columns={[
            { key: "name", label: "Organization", sortable: true },
            { key: "email", label: "Email", sortable: false },
            { key: "phone", label: "Phone", sortable: false },

            // ⭐ ADD THIS COLUMN
            // { key: "actions", label: "Actions", sortable: false },
          ]}
          data={ngos}
          actions={(row) => (
            <div className="flex items-center gap-2 justify-end">
              {/* View Button */}
              <button
                onClick={() => setSelectedNgo(row)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition"
              >
                View
              </button>

              {/* Delete Icon */}
              <button
                onClick={() => deleteNgo(row.id)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        />


        {selectedNgo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">NGO Details</h3>
                <button onClick={() => setSelectedNgo(null)} className="p-1 hover:bg-muted rounded transition">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Organization Name</p>
                  <p className="font-semibold text-foreground">{selectedNgo.name}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground">{selectedNgo.email}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold text-foreground">{selectedNgo.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-semibold text-foreground">{selectedNgo.address}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedNgo(null)}
                  className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
