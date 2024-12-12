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
  users: { getAll: "/users", staff: "/staff", clinicStaff: "/clinic-staff" },
  patients: { getAll: "/patients" },
  clinicPatients: {
    getByClinic: "/clinic-patients/getByClinicId",
    getAll: "/clinic-patients",
  },
  treatments: {
    getByClinic: "/treatments/getByClinicId",
    getAll: "/treatments",
    plans: "/treatment-plans",
    dentalNotes: "/dental-notes",
    investigations: "/investigations",
    prescriptions: "/treatment-prescriptions",
    payments: "/treatment-payments",
  },
  dentalChart: {
    getAll: "dental-charts",
  },
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
    patients: "/clinic-patients",
    patientsByClinicId: "/clinic-patients/getByClinicId",
    addPatient: "/clinics/add-patient",
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
