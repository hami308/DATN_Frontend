import axiosClient from "../api";

export const getJobDetailApi = async (jobId) => {
  const response = await axiosClient.get(`/jobs/${jobId}`);

  return response.data;
};

export const getCompanyJobsApi = async (companyId) => {
  const response = await axiosClient.get(`/jobs/company/${companyId}`);

  return response.data;
};
