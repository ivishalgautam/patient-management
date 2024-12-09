import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const getSlotByDateAndClinic = async (clinicId, day) => {
  const { data } = await http().get(
    `${endpoints.blockSlots.getByDateAndClinic}?clinic=${clinicId}&date=${day}`,
  );
  return data;
};

export const getByClinicId = async (id) => {
  const { data } = await http().get(
    `${endpoints.slots.getAll}/getByClinicId/${id}`,
  );
  return data;
};

export const deleteSlotById = async (id) => {
  const { data } = await http().delete(`${endpoints.slots.getAll}/${id}`);
  return data;
};
