import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

const fetchTreatments = async (patientId, clinicId) => {
  const { data } = await http().get(
    `${endpoints.treatments.getAll}/getByPatientAndClinicId/${patientId}/${clinicId}`,
  );
  return data.treatments;
};

export default function useFetchPatientTreatments(patientId, clinicId) {
  return useQuery({
    queryKey: [`patient-treatments-${patientId}-${clinicId}`],
    queryFn: () => fetchTreatments(patientId, clinicId),
    enabled: !!patientId && !!clinicId,
  });
}
