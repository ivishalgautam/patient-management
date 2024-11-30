import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const fetchProcedures = async () => {
  const { data } = await http().get(endpoints.procedures.getAll);
  return data.procedures.map(({ id: value, name: label }) => ({
    value,
    label: String(label).toLocaleUpperCase(),
  }));
};

export default function useFetchProcedures() {
  return useQuery({ queryKey: ["procedures"], queryFn: fetchProcedures });
}
