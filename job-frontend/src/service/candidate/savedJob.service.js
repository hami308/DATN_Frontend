import axiosClient from "../api";

export const getMySavedJobsApi = async () => {
  return await axiosClient.get("/candidate/saved-jobs");
};

export const saveMyJobApi = async (jobId) => {
  return await axiosClient.post(`/candidate/saved-jobs/${jobId}`);
};

export const unsaveMyJobApi = async (jobId) => {
  return await axiosClient.delete(`/candidate/saved-jobs/${jobId}`);
};
