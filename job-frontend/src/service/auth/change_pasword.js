import axiosClient from "../api";

export const changpasswordApi = async (data) => {
  const response = await axiosClient.patch(
    "/auth/change-password",
    data
  );

  return response.data;
};