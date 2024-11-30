export const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/register",
    refresh: "/auth/refresh",
    username: "/auth/username",
    verifyOtp: "/auth/verify",
  },
  files: {
    upload: "/upload/files",
    getFiles: "/upload",
  },
  profile: "/users/me",
  users: { getAll: "/users" },
  reports: { getAll: "/reports" },
  procedures: {
    getAll: "/procedures",
    getOne: "/procedures/getById",
  },
  services: {
    getAll: "/services",
    doctor: "/doctor-services",
  },
  banners: {
    getAll: "/banners",
  },
  clinics: {
    getAll: "/clinics",
  },
  slots: {
    getAll: "/slots",
  },
  bookings: {
    getAll: "/bookings",
  },
  blockSlots: {
    getAll: "/block-slots",
    getByClinicId: "/block-slots/getByClinicId",
    getByDateAndClinic: "/block-slots/getByDateAndClinic",
  },
};
