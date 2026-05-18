import axiosClient from "../api";

export const getJobDetailApi = async (jobId) => {
  const response = await axiosClient.get(`/jobs/${jobId}`);

  return response.data;
};
