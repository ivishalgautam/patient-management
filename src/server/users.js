import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function fetchUsers(params) {
  const { data } = await http().get(`${endpoints.users.getAll}?${params}`);
  return data;
}

export async function fetchUser(id) {
  const { data } = await http().get(`${endpoints.users.getAll}/${id}`);
  return data;
}

export async function fetchPatients(params) {
  const { data } = await http().get(
    `${endpoints.users.getAll}/patients?${params}`,
  );
  return data;
}

export async function fetchPatientsByClinicId(clinicId, params) {
  const { data } = await http().get(
    `${endpoints.users.getAll}/patients/getByClinicId/${clinicId}?${params}`,
  );
  return data;
}

export async function deleteUser(id) {
  return http().delete(`${endpoints.users.getAll}/${id}`);
}

export async function updateUser(data, userId) {
  return await http().put(`${endpoints.users.getAll}/${userId}`, data);
}

export async function updateUserStatus(customerId, status) {
  return await http().put(`${endpoints.users.getAll}/status/${customerId}`, {
    is_active: status,
  });
}

export async function fetchTutor(tutorId) {
  const { record } = await http().get(`${endpoints.users.getAll}/${tutorId}`);
  return record;
}
