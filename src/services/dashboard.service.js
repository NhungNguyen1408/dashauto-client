import api from "./api";

export const getStats = async () => {
  const { data } = await api.get("/dashboard/stats");
  return data;
};

export const getRevenue = async (groupBy = "day") => {
  const { data } = await api.get("/dashboard/revenue", { params: { groupBy } });
  return data;
};

export const getTopProducts = async (limit = 5) => {
  const { data } = await api.get("/dashboard/top-products", { params: { limit } });
  return data;
};

export const getKpi = async (by = "region") => {
  const { data } = await api.get("/dashboard/kpi", { params: { by } });
  return data;
};
