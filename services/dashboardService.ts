import api from "@/lib/api";

export const getChiefDashboard = async () => {
  const res = await api.get("/dashboard/chief");
  return res.data;
};
