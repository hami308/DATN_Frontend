import axiosClient from "../api";

export const createPendingCompany = async (data) => {
  const response = await axiosClient.post(
    "/companies/pending",
    data
  );

  return response.data;
};

export const getMyPendingCompanies = async () => {
  const response = await axiosClient.get(
    "/companies/pending/me"
  );

  return response.data;
};

export const updatePendingCompany = async (
  pendingCompanyId,
  data
) => {
  const response = await axiosClient.patch(
    `/companies/pending/${pendingCompanyId}`,
    data
  );

  return response.data;
};

export const updatePendingCompanyCertificate = async (data) => {
  const res = await axiosClient.patch("/companies/pending/certificate", data);
  return res.data;
};