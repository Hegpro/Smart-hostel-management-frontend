import api from "@/lib/api";

// ✅ 1. Get all rooms of a hostel
export const getRoomsByHostel = async (hostelId: string) => {
  const res = await api.get(`/rooms/hostel/${hostelId}`);
  return res.data;
};

// ✅ 2. Get latest notices
export const getNotices = async () => {
  const res = await api.get("/notices");
  return res.data.notices || res.data;
};

export const getRoomStudents = async (roomId: string) => {
  const res = await api.get(`/auth/students/room/${roomId}`);
  return res.data;
};
// (Optional future) — if needed
// export const resetAcademicYear = async () => {
//   return await api.delete("/academic-year");
// };
