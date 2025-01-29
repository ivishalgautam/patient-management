"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Stethoscope } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ClinicContext } from "@/store/clinic-context";
import { useLocalStorage } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";

export function ClinicSwitcher({ clinics }) {
  const { clinic, setClinic } = React.useContext(ClinicContext);
  const [localClinic, setLocalClinic] = useLocalStorage("clinic", clinic);
  const { isMobile } = useSidebar();
  const handleClinicChange = (clinic) => {
    setClinic(clinic);
    setLocalClinic(clinic);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                <Stethoscope className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{clinic.name}</span>
                <span className="truncate text-xs capitalize">
                  {clinic.address}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Clinics
            </DropdownMenuLabel>
            {clinics.map((clnc, index) => (
              <DropdownMenuItem
                key={clnc.name}
                onClick={() => handleClinicChange(clnc)}
                className={cn("gap-2 p-2 hover:bg-gray-100", {
                  "bg-gray-200": clinic.id == clnc.id,
                })}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Stethoscope size={5} className="shrink-0" />
                </div>
                <div className="flex flex-col items-start justify-start">
                  <span className="text-xs">{clnc.name}</span>
                  <span className="text-xs capitalize text-gray-500">
                    {clnc.address}
                  </span>
                </div>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
