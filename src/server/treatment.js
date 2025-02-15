import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function fetchTreatmentsByClinicId(clinicId, params) {
  const { data } = await http().get(
    `${endpoints.treatments.getByClinic}/${clinicId}?${params}`,
  );
  return data;
}

export async function fetchTreatmentsByPatientAndClinicId(
  patientId,
  clinicId,
  params,
) {
  const { data } = await http().get(
    `${endpoints.treatments.getByPatientAndClinic}/${patientId}/${clinicId}?${params}`,
  );
  return data;
}

export async function fetchTreatment(id) {
  const { data } = await http().get(`${endpoints.treatments.getAll}/${id}`);
  return data;
}

export async function createTreatmentPlan(data) {
  const resp = await http().post(`${endpoints.treatments.plans}`, data);
  return resp.data;
}

export const fetchTreatmentPlans = async (treatmentId, params) => {
  const { data } = await http().get(
    `${endpoints.treatments.plans}/getByTreatmentId/${treatmentId}?${params}`,
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

export const fetchDentalNotes = async (patientId, params) => {
  const { data } = await http().get(
    `${endpoints.treatments.dentalNotes}/getByPatientId/${patientId}?${params}`,
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

// notes
export async function createNote(data) {
  const resp = await http().post(`${endpoints.treatments.notes}`, data);
  return resp.data;
}

export const fetchNotes = async (patientId, params) => {
  const { data } = await http().get(
    `${endpoints.treatments.notes}/getByPatientId/${patientId}?${params}`,
  );
  return data;
};

export const fetchNote = async (id) => {
  const { data } = await http().get(`${endpoints.treatments.notes}/${id}`);
  return data;
};

export async function deleteNote(id) {
  const { data } = await http().delete(`${endpoints.treatments.notes}/${id}`);
  return data;
}

export async function updateNote(id, data) {
  const resp = await http().put(`${endpoints.treatments.notes}/${id}`, data);
  return resp.data;
}

// x-rays
export async function createXray(formData) {
  const resp = await http().post(
    `${endpoints.treatments.xrays}`,
    formData,
    true,
  );
  return resp.data;
}

export const fetchXrays = async (treatementId, params) => {
  const { data } = await http().get(
    `${endpoints.treatments.xrays}/getByTreatmentId/${treatementId}?${params}`,
  );
  return data;
};

export const fetchXray = async (id) => {
  const { data } = await http().get(`${endpoints.treatments.xrays}/${id}`);
  return data;
};

export async function deleteXray(id) {
  const { data } = await http().delete(`${endpoints.treatments.xrays}/${id}`);
  return data;
}

export async function updateXray(id, data) {
  const resp = await http().put(`${endpoints.treatments.xrays}/${id}`, data);
  return resp.data;
}

// documents
export async function createDocument(data) {
  const resp = await http().post(
    `${endpoints.treatments.documents}`,
    data,
    true,
  );
  return resp.data;
}

export const fetchDocuments = async (patientId, params) => {
  const { data } = await http().get(
    `${endpoints.treatments.documents}/getByPatientId/${patientId}?${params}`,
  );
  return data;
};

export const fetchDocument = async (id) => {
  const { data } = await http().get(`${endpoints.treatments.documents}/${id}`);
  return data;
};

export async function deleteDocument(id) {
  const { data } = await http().delete(
    `${endpoints.treatments.documents}/${id}`,
  );
  return data;
}

export async function updateDocument(id, data) {
  const resp = await http().put(
    `${endpoints.treatments.documents}/${id}`,
    data,
    true,
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
export async function updateTreatment(treatmentId, data) {
  return await http().put(
    `${endpoints.treatments.getAll}/${treatmentId}`,
    data,
  );
}
export const fetchPayments = async (treatementId, params) => {
  const { data } = await http().get(
    `${endpoints.treatments.payments}/getByTreatmentId/${treatementId}?${params}`,
  );
  return data;
};

export const fetchPaymentsByPatient = async (patientId, params) => {
  const { data } = await http().get(
    `${endpoints.treatments.payments}/getByPatientId/${patientId}?${params}`,
  );
  return data;
};

export const fetchAccounts = async (clinicId) => {
  return await http().get(
    `${endpoints.treatments.payments}/accounts/${clinicId}`,
  );
  return data;
};

export const fetchRemainingPayment = async (treatementId) => {
  const { data } = await http().get(
    `${endpoints.treatments.payments}/getRemainingPayment/${treatementId}`,
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
