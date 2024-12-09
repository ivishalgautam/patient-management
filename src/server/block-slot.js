import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function createBlockSlot(formData) {
  const { data } = await http().post(
    `${endpoints.blockSlots.getAll}`,
    formData,
  );
  return data;
}

export async function createBookSlot(formData) {
  const { data } = await http().post(`${endpoints.bookings.getAll}`, formData);
  return data;
}

export async function fetchBlockSlotsByClinicId(params = "", type, clinicId) {
  const { data } = await http().get(
    `${endpoints.blockSlots.getByClinicId}/${clinicId}?type=${type}&${params}`,
  );
  return data;
}

export async function deleteBlockSlot(data) {
  return http().delete(`${endpoints.blockSlots.getAll}/${data.id}`);
}

export async function updateBlockSlot(data, userId) {
  return await http().put(`${endpoints.blockSlots.getAll}/${userId}`, data);
}
