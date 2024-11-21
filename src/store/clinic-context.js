"use client";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { MainContext } from "./context";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useLocalStorage } from "@uidotdev/usehooks";

export const ClinicContext = createContext(null);

function ClinicContextProvider({ children }) {
  const { user } = useContext(MainContext);
  const [clinic, setClinic] = useState({});
  const [localClinic, setLocalClinic] = useLocalStorage("clinic", null);

  const { data: clinics, isLoading: isClinicLoading } = useQuery({
    queryKey: [`clinics`, user],
    queryFn: async () => {
      const { data } = await http().get(endpoints.clinics.getAll);
      setClinic(
        localClinic?.id
          ? data.clinics?.find((so) => so.id === localClinic.id) ?? {}
          : data.clinics?.[0] ?? {},
      );
      return data.clinics;
    },
    enabled: !!user,
  });

  return (
    <ClinicContext.Provider
      value={{
        clinic,
        setClinic,
        clinics,
        isClinicLoading,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export default ClinicContextProvider;
