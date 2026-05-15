import axiosClient from "../api";

export const getRecruiterInfor = async () => {
  const response = await axiosClient.get(
    "/recruiters/me"
  );

  return response.data;
};