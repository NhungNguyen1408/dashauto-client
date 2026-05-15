import api from "./api";

export const listProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data;
};