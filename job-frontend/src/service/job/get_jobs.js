import axiosClient from "../api";

export const getJobsApi = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();

  const response = await axiosClient.get(`/jobs?${queryString}`);
  console.log("RESPONSE:", response.data);

  return response.data;
};
