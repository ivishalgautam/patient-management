import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const fetchBookingsByClinicId = async (params, id) => {
  const { data } = await http().get(
    `${endpoints.bookings.getAll}/getByClinicId/${id}?${params}`,
  );
  return data;
};

export const getBookedSlotByDateAndClinic = async (clinicId, day) => {
  const { data } = await http().get(
    `${endpoints.bookings.getByDateAndClinic}?clinic=${clinicId}&date=${day}`,
  );
  return data;
};

export const fetchBookings = async () => {
  const { data } = await http().get(`${endpoints.bookings.getAll}`);
  return data;
};

export const updateBooking = async (id, formData) => {
  const { data } = await http().put(
    `${endpoints.bookings.getAll}/${id}`,
    formData,
  );
  return data;
};

export const updateBookingStatus = async (id, formData) => {
  return await http().put(
    `${endpoints.bookings.getAll}/status/${id}`,
    formData,
  );
};
