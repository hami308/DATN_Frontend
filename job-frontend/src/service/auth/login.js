import axiosClient from "../api";

export const loginApi = async (data) => {
  const response = await axiosClient.post(
    "/auth/login",
    data
  );

  return response.data;
};