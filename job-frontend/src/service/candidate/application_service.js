import axiosClient from "../api";

export const applyJobApi = async ({ jobId, cvId }) => {
  return await axiosClient.post(`/candidate/jobs/${jobId}/apply`, {
    cvId,
  });
};
export const getMyApplicationsApi = async () => {
  return await axiosClient.get("/candidate/applications");
};
