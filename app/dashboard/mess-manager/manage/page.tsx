"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import DataTable from "@/components/dashboard/data-table";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";

const BASE_URL = "http://localhost:5000";

export default function ManageDistributionPage() {
  const [user, setUser] = useState<any>(null);
  const [distributions, setDistributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDistribution, setSelectedDistribution] = useState<any>(null);
  const [updatedStatus, setUpdatedStatus] = useState("");

  // Fetch Mess Manager profile
  const getProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("PROFILE ERROR:", err);
    }
  };

  // Fetch all surplus posts (surplus food items)
  const getDistributionPosts = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/surplus/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await res.json();

      const mapped = data.surplus.map((item: any) => ({
        id: item._id,
        item: item.item || item.title || "Food Item",
        quantity: item.quantity || "N/A",
        ngo: item.claimedBy?.name || "Waiting...",
        ngoId: item.claimedBy?._id || null,
        status: item.status, // available / claimed / distributed
        date: new Date(item.createdAt).toLocaleDateString(),
        raw: item,
      }));

      setDistributions(mapped);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setDistributions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (user) getDistributionPosts();
  }, [user]);

  // Update distribution status
  const handleStatusUpdate = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/surplus/status/${selectedDistribution.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: updatedStatus }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      await getDistributionPosts();
      setSelectedDistribution(null);
      setUpdatedStatus("");

    } catch (err) {
      console.error("UPDATE ERROR:", err);
      alert("Something went wrong");
    }
  };

  const menuItems = [
    { icon: "📊", label: "Dashboard", href: "/dashboard/mess-manager" },
    {
      icon: "📦",
      label: "Manage Distribution",
      href: "/dashboard/mess-manager/manage",
    },
    { icon: "👥", label: "View NGOs", href: "/dashboard/mess-manager/ngos" },
  ];

  return (
    <DashboardLayout menuItems={menuItems} role="Mess Manager" userName={user?.name || "Manager"}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/mess-manager" className="p-2 hover:bg-muted rounded-lg transition">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Manage Distribution</h2>
            <p className="text-muted-foreground mt-1">Track and manage food distribution to NGOs</p>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            columns={[
              { key: "item", label: "Item", sortable: true },
              { key: "quantity", label: "Quantity", sortable: false },
              { key: "ngo", label: "NGO", sortable: true },
              { key: "status", label: "Status", sortable: true },
              { key: "date", label: "Date", sortable: true },
            ]}
            data={distributions}
            actions={(row) =>
              row.status === "available" ? (
                <button
                  onClick={() => {
                    setSelectedDistribution(row);
                    setUpdatedStatus("distributed");
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition"
                >
                  Update
                </button>
              ) : (
                <span className="text-muted-foreground text-sm">No Actions</span>
              )
            }
          />
        )}

        {/* Modal */}
        {selectedDistribution && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">Update Distribution</h3>
                <button
                  onClick={() => setSelectedDistribution(null)}
                  className="p-1 hover:bg-muted rounded transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Item</p>
                  <p className="font-semibold text-foreground">{selectedDistribution.item}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-semibold text-foreground">{selectedDistribution.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">NGO</p>
                  <p className="font-semibold text-foreground">{selectedDistribution.ngo}</p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Update Status</label>
                  <select
                    value={updatedStatus}
                    onChange={(e) => setUpdatedStatus(e.target.value)}
                    className="w-full mt-2 px-4 py-2 bg-input border border-border rounded-lg text-foreground"
                  >
                    <option value="distributed">Distributed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleStatusUpdate}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
                >
                  Update
                </button>
                <button
                  onClick={() => setSelectedDistribution(null)}
                  className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
