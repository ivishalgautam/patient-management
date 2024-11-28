import {
  FileText,
  HandCoins,
  LayoutDashboard,
  ListChecks,
  User,
  Users,
} from "lucide-react";

const ROLES = {
  ADMIN: "admin",
  PATIENT: "patient",
  DOCTOR: "doctor",
  USER: "user",
};

export const sidebarData = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT],
    isVisible: true,
    items: [],
  },
  {
    title: "User",
    url: "#",
    icon: Users,
    roles: [ROLES.ADMIN],
    isVisible: true,
    items: [
      {
        title: "All Users",
        url: "/users",
        roles: [ROLES.ADMIN],
        isVisible: true,
      },
      {
        title: "My Patients",
        url: "/users/my-patients",
        roles: [ROLES.DOCTOR],
        isVisible: true,
      },
      {
        title: "Add Doctor",
        url: "/users/create/doctor",
        roles: [ROLES.ADMIN],
        isVisible: true,
      },
      {
        title: "Add Patient",
        url: "/users/create/patient",
        roles: [ROLES.ADMIN, ROLES.DOCTOR],
        isVisible: true,
      },
    ],
  },
  {
    title: "Patients",
    url: "#",
    icon: Users,
    roles: [ROLES.DOCTOR],
    isVisible: true,
    items: [
      {
        title: "All Patients",
        url: "/patients",
        roles: [ROLES.DOCTOR],
        isVisible: true,
      },
      {
        title: "Clinic Patients",
        url: "/patients/clinic-patients",
        roles: [ROLES.DOCTOR],
        isVisible: true,
      },
      {
        title: "Add Patient",
        url: "/users/create/patient",
        roles: [ROLES.ADMIN, ROLES.DOCTOR],
        isVisible: true,
      },
    ],
  },
  {
    title: "Procedures",
    url: "#",
    icon: FileText,
    roles: [ROLES.ADMIN],
    isVisible: true,
    items: [
      {
        title: "All Procedures",
        url: "/procedures",
        roles: [ROLES.ADMIN],
        isVisible: true,
      },
      {
        title: "Add new",
        url: "/procedures/create",
        roles: [ROLES.ADMIN],
        isVisible: true,
      },
    ],
  },
  {
    title: "Services",
    url: "#",
    icon: HandCoins,
    roles: [ROLES.ADMIN, ROLES.DOCTOR],
    isVisible: true,
    items: [
      {
        title: "All Services",
        url: "/services",
        roles: [ROLES.ADMIN],
        isVisible: true,
      },
      {
        title: "Add New",
        url: "/services/create",
        roles: [ROLES.ADMIN],
        isVisible: true,
      },
      {
        title: "My Services",
        url: "/services/doctor",
        roles: [ROLES.DOCTOR],
        isVisible: true,
      },
      {
        title: "My Services",
        url: "/services/doctor/create",
        roles: [ROLES.DOCTOR],
        isVisible: false,
      },
    ],
  },
  {
    title: "Banners",
    url: "#",
    icon: FileText,
    roles: [ROLES.ADMIN],
    isVisible: true,
    items: [
      {
        title: "All Banners",
        url: "/banners",
        roles: [ROLES.ADMIN],
        isVisible: true,
      },
      {
        title: "Add New",
        url: "/banners/create",
        roles: [ROLES.ADMIN],
        isVisible: true,
      },
    ],
  },
  {
    title: "Slots",
    url: "#",
    icon: FileText,
    roles: [ROLES.DOCTOR],
    isVisible: true,
    items: [
      {
        title: "My Slots",
        url: "/slots",
        roles: [ROLES.DOCTOR],
        isVisible: true,
      },
      {
        title: "Edit",
        url: "/slots/edit/[id]",
        roles: [ROLES.DOCTOR],
        isVisible: false,
      },
      {
        title: "Create",
        url: "/slots/create",
        roles: [ROLES.DOCTOR],
        isVisible: false,
      },
      {
        title: "Blocked Dates",
        url: "/slots/blocked/dates",
        roles: [ROLES.DOCTOR],
        isVisible: true,
      },
      {
        title: "Blocked Slots",
        url: "/slots/blocked/slots",
        roles: [ROLES.DOCTOR],
        isVisible: true,
      },
      {
        title: "Blocked Slots create",
        url: "/slots/blocked/create/date",
        roles: [ROLES.DOCTOR],
        isVisible: false,
      },
      {
        title: "Blocked Slots create",
        url: "/slots/blocked/create/slot",
        roles: [ROLES.DOCTOR],
        isVisible: false,
      },
      {
        title: "Blocked Slots edit",
        url: "/slots/blocked/edit/[id]",
        roles: [ROLES.DOCTOR],
        isVisible: false,
      },
    ],
  },
  {
    title: "Appointments",
    url: "#",
    icon: ListChecks,
    roles: [ROLES.DOCTOR],
    isVisible: true,
    items: [
      {
        title: "My Appointments",
        url: "/appointments",
        roles: [ROLES.DOCTOR],
        isVisible: true,
      },
    ],
  },
  {
    title: "Profile Overview",
    url: "/profile",
    icon: User,
    roles: [ROLES.ADMIN, ROLES.PATIENT, ROLES.DOCTOR],
    isVisible: true,
    items: [],
  },
];

export const publicRoutes = [
  "/",
  "/admin",
  "/register",
  "/reviews/create",
  "/thank-you",
  "/progress",
];
