import axiosClient from "../api";

export const createJobApi = async (data) => {
  const response = await axiosClient.post("/jobs/create", data);

  return response.data;
};
