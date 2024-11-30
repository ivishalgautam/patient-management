import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const fetchClinic = async (id) => {
  const { data } = await http().get(`${endpoints.clinics.getAll}/${id}`);
  return data;
};

export const fetchClinics = async () => {
  const { data } = await http().get(endpoints.clinics.getAll);
  return data;
};

export const deleteClinic = async (id) => {
  return await http().delete(`${endpoints.clinics.getAll}/${id}`);
};

export const createClinic = async (data) => {
  const response = await http().post(`${endpoints.clinics.getAll}`, data);
  return response.data;
};

export const updateClinic = async (id, data) => {
  const response = await http().put(`${endpoints.clinics.getAll}/${id}`, data);
  return response.data;
};
