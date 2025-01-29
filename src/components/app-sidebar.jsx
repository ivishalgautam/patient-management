"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { sidebarData } from "@/data/routes";
import { MainContext } from "@/store/context";
import { NavUser } from "./nav-user";
import { ClinicSwitcher } from "./clinic-switcher";
import { Skeleton } from "./ui/skeleton";
import { ClinicContext } from "@/store/clinic-context";

export function AppSidebar({ ...props }) {
  const { user, isUserLoading } = React.useContext(MainContext);
  const { clinics, isClinicLoading } = React.useContext(ClinicContext);

  const filteredRoutes = sidebarData
    .filter((route) => route.roles.includes(user?.role))
    .map((item) => {
      return {
        ...item,
        items: item.items.filter(
          (item) => item.roles.includes(user?.role) && item.isVisible,
        ),
      };
    });

  if (isUserLoading)
    return (
      <Skeleton className={"z-10 h-screen w-(--sidebar-width) bg-gray-300"} />
    );

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        {user?.role === "admin" ? (
          ""
        ) : isClinicLoading ? (
          <Skeleton className={"h-12 bg-gray-800"}></Skeleton>
        ) : clinics ? (
          <ClinicSwitcher clinics={clinics} />
        ) : null}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredRoutes} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
