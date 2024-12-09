import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function deleteBanner({ id }) {
  return await http().delete(`${endpoints.banners.getAll}/${id}`);
}

export async function updateBanner(id, data) {
  return await http().put(`${endpoints.banners.getAll}/${id}`, data);
}

export async function fetchBanners(params) {
  const { data } = await http().get(`${endpoints.banners.getAll}?${params}`);
  return data;
}

export async function fetchBanner(id) {
  const { data } = await http().get(`${endpoints.banners.getAll}/${id}`);
  return data;
}

export async function createBanner(data) {
  const resp = await http().post(`${endpoints.banners.getAll}`, data);
  return resp.data;
}
