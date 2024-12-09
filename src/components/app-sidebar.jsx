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
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { ClinicSwitcher } from "./clinic-switcher";
import { Skeleton } from "./ui/skeleton";
import { ClinicContext } from "@/store/clinic-context";

export function AppSidebar({ ...props }) {
  const { user } = React.useContext(MainContext);
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
