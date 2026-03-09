import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export async function createLedger(data) {
  const resp = await http().post(`${endpoints.ledgers.getAll}`, data);
  return resp.data;
}

export const getLedgers = async (searchParams) => {
  const { data } = await http().get(
    `${endpoints.ledgers.getAll}?${searchParams}`,
  );
  return data;
};

export const fetchLedgerByClinicAndPatient = async (clinicId, patientId) => {
  const { data } = await http().get(
    `${endpoints.ledgers.getAll}/${clinicId}/${patientId}`,
  );
  return data;
};

export const deleteLedger = async (id) => {
  return await http().delete(`${endpoints.ledgers.getAll}/${id}`);
};
