import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function fetchTreatmentsByClinicId(clinicId, params) {
  const { data } = await http().get(
    `${endpoints.treatments.getByClinic}/${clinicId}?${params}`,
  );
  return data;
}

export async function fetchTreatment(id) {
  const { data } = await http().get(`${endpoints.treatments.getAll}/${id}`);
  return data;
}

export async function createDentalChart(data) {
  const resp = await http().post(`${endpoints.dentalChart.getAll}`, data);
  return resp.data;
}

export async function createTreatmentPlan(data) {
  const resp = await http().post(`${endpoints.treatments.plans}`, data);
  return resp.data;
}

export async function fetchDentalChartByTreatment(id) {
  const { data } = await http().get(
    `${endpoints.dentalChart.getAll}/getByTreatmentId/${id}`,
  );
  return data;
}

export const fetchTreatmentPlans = async (treatementId, params) => {
  const { data } = await http().get(
    `${endpoints.treatments.plans}/getByTreatmentId/${treatementId}?${params}`,
  );
  return data;
};

export const fetchTreatmentPlan = async (id) => {
  const { data } = await http().get(`${endpoints.treatments.plans}/${id}`);
  return data;
};

export async function deleteTreatmentPlan(id) {
  const { data } = await http().delete(`${endpoints.treatments.plans}/${id}`);
  return data;
}

export async function updateTreatmentPlan(id, data) {
  const resp = await http().put(`${endpoints.treatments.plans}/${id}`, data);
  return resp.data;
}

// dental notes
export async function createDentalNote(data) {
  const resp = await http().post(`${endpoints.treatments.dentalNotes}`, data);
  return resp.data;
}

export const fetchDentalNotes = async (treatementId, params) => {
  const { data } = await http().get(
    `${endpoints.treatments.dentalNotes}/getByTreatmentId/${treatementId}?${params}`,
  );
  return data;
};

export const fetchDentalNote = async (id) => {
  const { data } = await http().get(
    `${endpoints.treatments.dentalNotes}/${id}`,
  );
  return data;
};

// export const fetchDentalNoteByToothAndTreatment = async (toothId,treatmentId) => {
//   const { data } = await http().get(
//     `${endpoints.treatments.dentalNotes}/${id}`,
//   );
//   return data;
// };

export async function deleteDentalNote(id) {
  const { data } = await http().delete(
    `${endpoints.treatments.dentalNotes}/${id}`,
  );
  return data;
}

export async function updateDentalNote(id, data) {
  const resp = await http().put(
    `${endpoints.treatments.dentalNotes}/${id}`,
    data,
  );
  return resp.data;
}

// investigation
export async function createInvestigation(data) {
  const resp = await http().post(
    `${endpoints.treatments.investigations}`,
    data,
  );
  return resp.data;
}

export const fetchInvestigations = async (treatementId, params) => {
  const { data } = await http().get(
    `${endpoints.treatments.investigations}/getByTreatmentId/${treatementId}?${params}`,
  );
  return data;
};

export const fetchInvestigation = async (id) => {
  const { data } = await http().get(
    `${endpoints.treatments.investigations}/${id}`,
  );
  return data;
};

export async function deleteInvestigation(id) {
  const { data } = await http().delete(
    `${endpoints.treatments.investigations}/${id}`,
  );
  return data;
}

export async function updateInvestigation(id, data) {
  const resp = await http().put(
    `${endpoints.treatments.investigations}/${id}`,
    data,
  );
  return resp.data;
}

// prescription
export async function createPrescription(data) {
  const resp = await http().post(`${endpoints.treatments.prescriptions}`, data);
  return resp.data;
}

export const fetchPrescriptions = async (treatementId, params) => {
  const { data } = await http().get(
    `${endpoints.treatments.prescriptions}/getByTreatmentId/${treatementId}?${params}`,
  );
  return data;
};

export const fetchPrescription = async (id) => {
  const { data } = await http().get(
    `${endpoints.treatments.prescriptions}/${id}`,
  );
  return data;
};

export async function deletePrescription(id) {
  const { data } = await http().delete(
    `${endpoints.treatments.prescriptions}/${id}`,
  );
  return data;
}

export async function updatePrescription(id, data) {
  const resp = await http().put(
    `${endpoints.treatments.prescriptions}/${id}`,
    data,
  );
  return resp.data;
}

// payments
export async function createPayment(data) {
  const resp = await http().post(`${endpoints.treatments.payments}`, data);
  return resp.data;
}

export const fetchPayments = async (treatementId, params) => {
  const { data } = await http().get(
    `${endpoints.treatments.payments}/getByTreatmentId/${treatementId}?${params}`,
  );
  return data;
};

export const fetchPayment = async (id) => {
  const { data } = await http().get(`${endpoints.treatments.payments}/${id}`);
  return data;
};

export async function deletePayment(id) {
  const { data } = await http().delete(
    `${endpoints.treatments.payments}/${id}`,
  );
  return data;
}

export async function updatePayment(id, data) {
  const resp = await http().put(`${endpoints.treatments.payments}/${id}`, data);
  return resp.data;
}
