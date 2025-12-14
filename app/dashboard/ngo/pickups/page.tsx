"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import DataTable from "@/components/dashboard/data-table";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL||"http://localhost:5000/api";

export default function PickupsPage() {
  const [pickups, setPickups] = useState<any[]>([]);
  const [selectedPickup, setSelectedPickup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch claimed surplus for NGO
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${BASE_URL}/surplus/claimed`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("FETCH ERROR:", data);
        setPickups([]);
        return;
      }

      const formatted = data.claimed.map((item: any) => ({
        id: item._id,
        item: item.title || "Unknown",
        quantity: item.quantity,
        scheduledDate: new Date(item.createdAt).toLocaleDateString(),
        location: "SDM CET Mess", // static since no location field from backend
        status: item.status === "claimed" ? "Claimed" : item.status,
        contact: "9876543210", // static - mess manager contact can be added later
        raw: item,
      }));

      setPickups(formatted);
    } catch (err) {
      console.error(err);
      setPickups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <DashboardLayout
      menuItems={[
        { icon: "📊", label: "Dashboard", href: "/dashboard/ngo" },
        { icon: "📦", label: "Pickups", href: "/dashboard/ngo/pickups" },
      ]}
      role="NGO"
      userName="NGO Representative"
    >
      <div className="p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/ngo" className="p-2 hover:bg-muted rounded-lg transition">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-foreground">My Pickups</h2>
            <p className="text-muted-foreground mt-1">
              View all surplus food you have claimed
            </p>
          </div>
        </div>

        {/* If no history */}
        {loading ? (
          <p className="text-foreground">Loading pickups…</p>
        ) : pickups.length === 0 ? (
          <p className="text-muted-foreground text-lg text-center py-10">
            No pickup history found.
          </p>
        ) : (
          <DataTable
            columns={[
              { key: "item", label: "Item", sortable: true },
              { key: "quantity", label: "Quantity", sortable: false },
              { key: "scheduledDate", label: "Date", sortable: true },
              { key: "status", label: "Status", sortable: true },
            ]}
            data={pickups}
            actions={(row) => (
              <button
                onClick={() => setSelectedPickup(row)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition"
              >
                Details
              </button>
            )}
          />
        )}

        {/* Modal */}
        {selectedPickup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">Pickup Details</h3>
                <button
                  onClick={() => setSelectedPickup(null)}
                  className="p-1 hover:bg-muted rounded transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Item</p>
                  <p className="font-semibold text-foreground">{selectedPickup.item}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-semibold text-foreground">{selectedPickup.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold text-foreground">{selectedPickup.scheduledDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold text-foreground">{selectedPickup.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold text-foreground">{selectedPickup.status}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPickup(null)}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
