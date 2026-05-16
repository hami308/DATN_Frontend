import axiosClient from "../api";

export const getAllIndustries = async () => {
  const response = await axiosClient.get("/industries");

  return response.data;
};
