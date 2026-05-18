import axiosClient from '../api';
export const updateJob = async (jobId, data) => {
  const response = await axiosClient.patch(`/jobs/${jobId}`, data);
  return response.data;
};