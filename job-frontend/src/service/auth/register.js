import axiosClient from "../api";

export const registerApi = async (data) => {
  const response = await axiosClient.post(
    "/auth/register",
    data
  );

  return response.data;
};