import axiosClient from "../api";

export const getCompanyInfor = async () => {
  const response = await axiosClient.get("/companies/profile/me");

  return response.data;
};

export const getAllCompanies = async () => {
  const response = await axiosClient.get("/companies");

  return response.data;
};

export const getCompanyDetailById = async (companyId) => {
  const response = await axiosClient.get(`/companies/profile/${companyId}`);

  return response.data;
};

export const getInforCompanyByname = async (companyName) => {
  const params = new URLSearchParams({ name: companyName });

  const response = await axiosClient.get(`/companies/by-name?${params}`);

  return response.data;
};

export const getCompaniesByNameFromCompanyTable =
  getInforCompanyByname;

export const updateCompany = async (companyId, companyData) => {
  const response = await axiosClient.patch(
    `/companies/${companyId}`,
    companyData
  );

  return response.data;
};