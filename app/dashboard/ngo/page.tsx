"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { ArrowLeft, MapPin, Clock } from "lucide-react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL||"http://localhost:5000/api";

const menuItems = [
  { icon: "📊", label: "Dashboard", href: "/dashboard/ngo" },
  { icon: "📦", label: "Pickups", href: "/dashboard/ngo/pickups" },
];

export default function FoodPage() {
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all available surplus items
  const getFood = async () => {
    try {
      const res = await fetch(`${BASE_URL}/surplus/available`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const data = await res.json();
      setFoodItems(
        (data.surplus || []).map((item: any) => ({
          id: item._id,
          item: item.title,
          quantity: item.quantity,
          expires: item.deadline?.split("T")[0],
          pickup: new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          location: "SDMCET Mess",
        }))
      );
    } catch (err) {
      console.error("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFood();
  }, []);

  // Claim button handler
  const claimFood = async (id: string) => {
    try {
      const res = await fetch(`${BASE_URL}/surplus/claim/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("You have successfully claimed the food!");
      getFood(); // Refresh dashboard
    } catch (err) {
      console.error("CLAIM ERROR:", err);
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} role="NGO" userName="NGO Representative">
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/ngo" className="p-2 hover:bg-muted rounded-lg transition">
            <ArrowLeft size={24} className="text-foreground" />
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Available Surplus Food</h2>
            <p className="text-muted-foreground mt-1">Claim food before it expires</p>
          </div>
        </div>

        {/* If loading */}
        {loading && <p>Loading food items…</p>}

        {/* If no food available */}
        {!loading && foodItems.length === 0 && (
          <div className="py-10 text-center text-muted-foreground text-lg">
            No surplus food available right now.
          </div>
        )}

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.map((food) => (
            <div key={food.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">{food.item}</p>
                  <p className="text-sm text-muted-foreground">{food.quantity}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Available
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-sm text-foreground">{food.location}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-primary" />
                  <span className="text-sm text-foreground">Posted: {food.pickup}</span>
                </div>

                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Expires:</span> {food.expires}
                </div>
              </div>

              <button
                onClick={() => claimFood(food.id)}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
              >
                Claim
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
