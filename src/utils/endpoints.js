export const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/register",
    refresh: "/auth/refresh",
    username: "/auth/username",
    verifyOtp: "/auth/verify",
  },

  profile: "/users/me",
  users: { getAll: "/users" },
  reports: { getAll: "/reports" },
  procedures: {
    getAll: "/procedures",
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
  blockSlots: {
    getAll: "/block-slots",
    getByClinicId: "/block-slots/getByClinicId",
    getByDateAndClinic: "/block-slots/getByDateAndClinic",
  },
};
