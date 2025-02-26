import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

const fetchServices = async () => {
  const { data } = await http().get(`${endpoints.services.getAll}`);
  return data.services;
};

export default function useFetchServices() {
  return useQuery({
    queryKey: [`services`],
    queryFn: fetchServices,
  });
}
