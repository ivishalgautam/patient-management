import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function createProcedure(data) {
  const resp = await http().post(`${endpoints.procedures.getAll}`, data);
  return resp.data;
}

export async function updateProcedure(id, data) {
  const resp = await http().put(`${endpoints.procedures.getAll}/${id}`, data);
  return resp.data;
}

export async function deleteProcedure(id) {
  return await http().delete(`${endpoints.procedures.getAll}/${id}`);
}

export async function fetchProcedures(params) {
  const { data } = await http().get(`${endpoints.procedures.getAll}?${params}`);

  return data;
}

export async function fetchProcedure(id) {
  const { data } = await http().get(`${endpoints.procedures.getOne}/${id}`);
  return data;
}
