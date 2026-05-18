import axiosClient from "../api";

export const getJobTypesApi = async () => {
  const response = await axiosClient.get("/jobs/job-types");

  return response.data;
};
