import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function deleteBanner({ id }) {
  return await http().delete(`${endpoints.banners.getAll}/${id}`);
}

export async function updateBanner(data) {
  return await http().put(`${endpoints.banners.getAll}/${data.id}`, data);
}

export async function fetchBanner(params) {
  const { data } = await http().get(`${endpoints.banners.getAll}?${params}`);
  return data;
}
