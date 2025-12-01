import api from "@/lib/api";

export const getChiefDashboard = async () => {
  const res = await api.get("/dashboard/chief");
  return res.data;
};

export const getWardenDashboard = async () => {
  const res = await api.get("/dashboard/warden");
  return res.data;
};
