"use client";
import { createContext, useEffect, useState } from "react";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { usePathname } from "next/navigation";

export const ExaminationContext = createContext(null);

function ExaminationProvider({ children, id }) {
  const [examination, setExamination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true);
      try {
        const { data } = await http().get(
          `${endpoints.comprehensiveExamination.getAll}/getByPatientId/${id}`,
        );
        setExamination(data);
        return data;
      } catch (error) {
        console.log("error fetching examination, ", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchDetails();
    }
  }, [id, pathname]);

  return (
    <ExaminationContext.Provider
      value={{
        examination: examination,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ExaminationContext.Provider>
  );
}

export default ExaminationProvider;
