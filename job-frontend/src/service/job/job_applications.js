import axiosClient from "../api";

export const getJobApplicationsApi = async (jobId) => {
  const response = await axiosClient.get(`/jobs/${jobId}/applications`);

  return response.data;
};

export const approveJobApplicationApi = async (applicationId) => {
  const response = await axiosClient.patch(
    `/jobs/applications/${applicationId}/approve`
  );

  return response.data;
};

export const rejectJobApplicationApi = async (
  applicationId,
  data
) => {
  const response = await axiosClient.patch(
    `/jobs/applications/${applicationId}/reject`,
    data
  );

  return response.data;
};
