import axiosClient from "../api";

export const getAdminDashboardApi = async (year) => {
  const query = year ? `?year=${year}` : "";
  const response = await axiosClient.get(`/admin/dashboard${query}`);

  return response.data;
};

export const getAdminAccountsApi = async () => {
  const response = await axiosClient.get("/admin/accounts");

  return response.data;
};
