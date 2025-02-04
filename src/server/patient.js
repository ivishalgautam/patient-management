import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function fetchPatient(id) {
  const { data } = await http().get(
    `${endpoints.users.getAll}/${id}/patient-details`,
  );
  return data;
}

export async function getPatientDetailsByPatientAndClinicId(
  patientId,
  clinicId,
) {
  const { data } = await http().get(
    `${endpoints.treatments.getPatientDetailsByPatientAndClinic}/${patientId}/${clinicId}`,
  );
  return data;
}
