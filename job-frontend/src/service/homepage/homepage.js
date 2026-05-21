import axiosClient from "../api";

export const getHomepageStatsApi = async () => {
  const response = await axiosClient.get("/homepage/stats");

  return response.data;
};
