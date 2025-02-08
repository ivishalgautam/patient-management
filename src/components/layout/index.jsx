"use client";
import React, { useContext, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { publicRoutes, sidebarData } from "@/data/routes";
import Context, { MainContext } from "@/store/context";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import ClinicContextProvider from "@/store/clinic-context";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

const parentRoutes = sidebarData.map((item) => ({
  title: item.title,
  url: item.url,
  roles: item.roles,
}));

const childRoutes = sidebarData.flatMap((item) =>
  item.items?.map((item) => ({
    title: item.title,
    url: item.url,
    roles: item.roles,
  })),
);

const filteredRoutes = [...parentRoutes, ...childRoutes];

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { id } = useParams();
  useEffect(() => {
    if (publicRoutes.some((route) => route === pathname)) {
      return;
    }
    const storedUser = localStorage.getItem("user");
    const currentUser = JSON.parse(storedUser);

    if (!currentUser) return router.replace("/");

    const filteredRoleBasedRoutes = filteredRoutes.filter((r) =>
      r.roles.includes(currentUser.role),
    );
    // Find the current route in the AllRoutes array
    const currentRoute = filteredRoleBasedRoutes?.find(
      (route) => route.url === pathname.replace(id, "[id]"),
    );
    // If the current route is not found in the array or the user's role is not allowed for this route
    if (!currentRoute?.roles?.includes(currentUser.role)) {
      router.replace("/unauthorized");
    }
  }, [pathname, id, router]);
  const getContent = () => {
    if (publicRoutes.includes(pathname)) {
      return children;
    }
    return (
      <Context>
        <ClinicContextProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full bg-gray-100">
              <SidebarTrigger />
              <ScrollArea className="h-[calc(100vh-30px)]">
                <div className="px-6 pb-2">
                  <Button
                    type="button"
                    className="mb-2 h-8"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    <ChevronLeft />
                    Back
                  </Button>
                  {children}
                </div>
              </ScrollArea>
            </main>
          </SidebarProvider>
        </ClinicContextProvider>
      </Context>
    );
  };

  return getContent();
}
