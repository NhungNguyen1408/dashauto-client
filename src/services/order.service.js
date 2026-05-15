import api from "./api";

export const listOrders = async (params = {}) => {
  const { data } = await api.get("/orders", { params });
  return data;
};