import axiosClient from "../api";

export const getLevelsApi = async () => {
  const response = await axiosClient.get("/levels");

  return response.data;
};
