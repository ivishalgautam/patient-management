"use client";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import { MainContext } from "./context";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";

export const ClinicContext = createContext(null);

function ClinicContextProvider({ children }) {
  const { user } = useContext(MainContext);
  const [clinic, setClinic] = useState({});
  const {
    data: clinics,
    isLoading: isClinicLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [`clinics-context`, user],
    queryFn: async () => {
      const { data } = await http().get(endpoints.clinics.getAll);
      const localClinic = JSON.parse(localStorage.getItem("clinic"));
      const clinicToSet =
        localClinic && data.clinics.some((cl) => cl.id === localClinic.id)
          ? data.clinics?.find((so) => so.id === localClinic.id) ?? {}
          : data.clinics?.[0] ?? {};

      setClinic(clinicToSet);
      return data.clinics;
    },
    enabled: !!user && !!["doctor", "staff"].includes(user.role),
  });

  console.log({ clinics });

  return (
    <ClinicContext.Provider
      value={{
        clinic,
        setClinic,
        clinics,
        refetchClinics: refetch,
        isClinicLoading,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export default ClinicContextProvider;
