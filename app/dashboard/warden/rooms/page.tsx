// "use client";

// import { useEffect, useState } from "react";
// import DashboardLayout from "@/components/layout/dashboard-layout";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";

// const menuItems = [
//   { icon: "📊", label: "Dashboard", href: "/dashboard/warden" },
//   { icon: "👥", label: "Student List", href: "/dashboard/warden/students" },
//   { icon: "🏠", label: "Room Management", href: "/dashboard/warden/rooms" },
//   { icon: <span>🛠️</span>, label: "Manage Staff", href: "/dashboard/warden/manage-staff" },
//   { icon: "⚠️", label: "Raise Complaint", href: "/dashboard/warden/raise-complaint" },
//   { icon: "📢", label: "Upload Notice", href: "/dashboard/warden/upload-notice" },
//   { icon: "📋", label: "View Complaints", href: "/dashboard/warden/complaints" },
// ];

// const HOSTEL_ID = "691e076ba2c5be3ba18a963d";

// export default function WardenRoomsPage() {
//   const [rooms, setRooms] = useState<any[]>([]);
//   const [selectedRoom, setSelectedRoom] = useState<any | null>(null);

//   const fetchRooms = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/rooms/hostel/${HOSTEL_ID}`
//       );
//       const data = await res.json();
//       setRooms(data.rooms || []);
//     } catch (error) {
//       console.error("Error fetching rooms:", error);
//     }
//   };

//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   // ---------- MARK AS MAINTENANCE ----------
//   const markMaintenance = async (roomId: string) => {
//     try {
//       const token = localStorage.getItem("token");

//       await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/status`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ status: "maintenance" }),
//         }
//       );

//       setSelectedRoom(null);
//       fetchRooms();
//     } catch (err) {
//       console.error("Failed to update status:", err);
//     }
//   };

//   const updateRoomStatus = async (roomId: string, newStatus: string) => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/status`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Failed to update room status");
//         return;
//       }

//       setSelectedRoom(null);   // close modal
//       fetchRooms();            // refresh room grid data

//     } catch (error) {
//       console.error("Error updating room:", error);
//     }
//   };


//   const getColor = (room: any) => {
//     if (room.status === "maintenance")
//       return "bg-yellow-100 text-yellow-700 border-yellow-300";

//     if (room.occupants.length >= room.capacity)
//       return "bg-red-100 text-red-700 border-red-300";

//     return "bg-green-100 text-green-700 border-green-300";
//   };

//   const isEmpty = (room: any) =>
//     room.status === "available" && room.occupants.length === 0;

//   return (
//     <DashboardLayout menuItems={menuItems} role="Warden" userName="Mr. Warden">
//       <div className="p-6 space-y-6">
//         {/* Header */}
//         <div className="flex items-center gap-4">
//           <Link href="/dashboard/warden" className="p-2 hover:bg-muted rounded-lg">
//             <ArrowLeft size={24} />
//           </Link>
//           <div>
//             <h2 className="text-3xl font-bold">Room Management</h2>
//             <p className="text-muted-foreground">Manage room status</p>
//           </div>
//         </div>

//         {/* Room Grid */}
//         <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
//           {rooms.map((room) => (
//             <div
//               key={room._id}
//               onClick={() => setSelectedRoom(room)}
//               className={`cursor-pointer border rounded-lg p-4 text-center font-semibold 
//               transition hover:scale-[1.03] ${getColor(room)}`}
//             >
//               <p className="text-lg font-bold">{room.roomNumber}</p>
//               <p className="text-xs mt-1">
//                 {room.occupants.length}/{room.capacity}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Selected Room Modal */}
//         {selectedRoom && (
//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//             <div className="bg-card border border-border p-6 rounded-lg w-full max-w-md">

//               <h3 className="text-xl font-bold mb-4">
//                 Room {selectedRoom.roomNumber}
//               </h3>

//               <p className="text-sm mb-2">
//                 Occupancy: {selectedRoom.occupants.length}/{selectedRoom.capacity}
//               </p>

//               <p className="text-sm mb-4 capitalize">
//                 Status: {selectedRoom.status}
//               </p>

//               {/* ⭐ CASE 1: AVAILABLE + EMPTY → Show "Mark as Maintenance" */}
//               {selectedRoom.status === "available" && selectedRoom.occupants.length === 0 && (
//                 <button
//                   onClick={() => updateRoomStatus(selectedRoom._id, "maintenance")}
//                   className="w-full py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
//                 >
//                   Mark as Maintenance
//                 </button>
//               )}

//               {/* ⭐ CASE 2: MAINTENANCE → Show "Mark as Available" */}
//               {selectedRoom.status === "maintenance" && (
//                 <button
//                   onClick={() => updateRoomStatus(selectedRoom._id, "available")}
//                   className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                 >
//                   Mark as Available
//                 </button>
//               )}

//               {/* Close Button */}
//               <button
//                 className="w-full mt-3 py-2 bg-muted rounded-lg"
//                 onClick={() => setSelectedRoom(null)}
//               >
//                 Close
//               </button>

//             </div>
//           </div>
//         )}

//       </div>
//     </DashboardLayout>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { icon: "📊", label: "Dashboard", href: "/dashboard/warden" },
  { icon: "👥", label: "Student List", href: "/dashboard/warden/students" },
  { icon: "🏠", label: "Room Management", href: "/dashboard/warden/rooms" },
  { icon: "🛠️", label: "Manage Staff", href: "/dashboard/warden/manage-staff" },
  { icon: "⚠️", label: "Raise Complaint", href: "/dashboard/warden/raise-complaint" },
  { icon: "📢", label: "Upload Notice", href: "/dashboard/warden/upload-notice" },
  { icon: "📋", label: "View Complaints", href: "/dashboard/warden/complaints" },
];

const HOSTEL_ID = "691e076ba2c5be3ba18a963d";

export default function WardenRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);

  const fetchRooms = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/hostel/${HOSTEL_ID}`
      );
      const data = await res.json();
      setRooms(data.rooms || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const updateRoomStatus = async (roomId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        alert("Failed to update room status");
        return;
      }

      setSelectedRoom(null);
      fetchRooms();
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  // 🎨 Updated color logic
  const getColor = (room: any) => {
    if (room.status === "maintenance")
      return "bg-yellow-100 text-yellow-700 border-yellow-300";

    if (room.occupants.length >= room.capacity)
      return "bg-red-100 text-red-700 border-red-300";

    return "bg-blue-100 text-blue-700 border-blue-300"; // AVAILABLE
  };

  return (
    <DashboardLayout menuItems={menuItems} role="Warden" userName="Mr. Warden">
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/warden" className="p-2 hover:bg-muted rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h2 className="text-3xl font-bold">Room Management</h2>
            <p className="text-muted-foreground">Manage room status</p>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {rooms.map((room) => (
            <div
              key={room._id}
              onClick={() => setSelectedRoom(room)}
              className={`cursor-pointer border rounded-lg p-4 text-center font-semibold 
              transition hover:scale-[1.03] ${getColor(room)}`}
            >
              <p className="text-lg font-bold">{room.roomNumber}</p>
              <p className="text-xs mt-1">
                {room.occupants.length}/{room.capacity}
              </p>
            </div>
          ))}
        </div>

        {/* ✅ CENTERED Room Status Legend */}
        <div className="flex justify-center mt-8">
          <div className="flex flex-wrap gap-8 px-6 py-3 border rounded-lg bg-muted/30">

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></span>
              <span className="text-sm font-medium">Available</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-red-100 border border-red-300"></span>
              <span className="text-sm font-medium">Fully Occupied</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></span>
              <span className="text-sm font-medium">Maintenance</span>
            </div>

          </div>
        </div>

        {/* Selected Room Modal */}
        {selectedRoom && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-card border border-border p-6 rounded-lg w-full max-w-md">

              <h3 className="text-xl font-bold mb-4">
                Room {selectedRoom.roomNumber}
              </h3>

              <p className="text-sm mb-2">
                Occupancy: {selectedRoom.occupants.length}/{selectedRoom.capacity}
              </p>

              <p className="text-sm mb-4 capitalize">
                Status: {selectedRoom.status}
              </p>

              {selectedRoom.status === "available" &&
                selectedRoom.occupants.length === 0 && (
                  <button
                    onClick={() =>
                      updateRoomStatus(selectedRoom._id, "maintenance")
                    }
                    className="w-full py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Mark as Maintenance
                  </button>
                )}

              {selectedRoom.status === "maintenance" && (
                <button
                  onClick={() =>
                    updateRoomStatus(selectedRoom._id, "available")
                  }
                  className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Mark as Available
                </button>
              )}

              <button
                className="w-full mt-3 py-2 bg-muted rounded-lg"
                onClick={() => setSelectedRoom(null)}
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

