import axiosClient from "../api";

export const getCompanyInfor = async () => {
  const response = await axiosClient.get(
    "/companies/profile/me"
  );

  return response.data;
};
export const getAllCompanies = async () => {
  const response = await axiosClient.get("/companies");

  return response.data;
};

export const getInforCompanyByname = async () => {
  const response = await axiosClient.get("/companies/searchByname");

  return response.data;
};

export const getCompanyById = async (companyId) => {
  const response = await axiosClient.get(`/companies/${companyId}`);

  return response.data;
};