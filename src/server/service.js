import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function deleteService({ id }) {
  return await http().delete(`${endpoints.services.getAll}/${id}`);
}

export async function fetchServices(params) {
  const { data } = await http().get(`${endpoints.services.getAll}?${params}`);
  return data;
}

export async function fetchFormattedServices(params) {
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
