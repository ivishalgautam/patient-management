import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";

export const createUser = async (data) => {
  return await await http().post(`${endpoints.users.getAll}`, data);
};
