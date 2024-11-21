import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function deleteProcedure({ id }) {
  return await http().delete(`${endpoints.procedures.getAll}/${id}`);
}

export async function fetchProcedures(params) {
  const { data } = await http().get(`${endpoints.procedures.getAll}?${params}`);

  return data;
}
