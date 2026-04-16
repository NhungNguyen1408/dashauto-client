import api from "./api";

export const getStats = async () => {
  const { data } = await api.get("/dashboard/stats");
  return data;
};

export const getRevenue = async (groupBy = "day") => {
  const { data } = await api.get("/dashboard/revenue", { params: { groupBy } });
  return data;
};
