import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const fetchBookingsByClinicId = async (id) => {
  const { data } = await http().get(
    `${endpoints.bookings.getAll}/getByClinicId/${id}`,
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
  const { data } = await http().put(
    `${endpoints.bookings.getAll}/${id}`,
    formData,
  );
  return data;
};
