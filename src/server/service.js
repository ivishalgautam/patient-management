import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function createService(data) {
  const resp = await http().post(`${endpoints.services.getAll}`, data);
  return resp.data;
}

export async function updateService(id, data) {
  const resp = await http().put(`${endpoints.services.getAll}/${id}`, data);
  return resp.data;
}

export async function deleteService(id) {
  return await http().delete(`${endpoints.services.getAll}/${id}`);
}

export async function fetchServices(params) {
  const { data } = await http().get(`${endpoints.services.getAll}?${params}`);
  return data;
}

export async function fetchService(id) {
  const { data } = await http().get(
    `${endpoints.services.getAll}/getById/${id}`,
  );
  return data;
}

export async function fetchFormattedServices(params = "") {
  const { data } = await http().get(`${endpoints.services.getAll}?${params}`);
  return (
    data?.services?.map(({ id: value, name: label }) => ({
      value,
      label,
    })) ?? []
  );
}

export async function fetchDoctorServices(params) {
  const { data } = await http().get(`${endpoints.services.doctor}?${params}`);
  return data;
}

export async function deleteDoctorService(id) {
  return await http().delete(`${endpoints.services.doctor}/${id}`);
}
