import axiosClient from "../api";

export const getRecruiterInfor = async () => {
  const response = await axiosClient.get(
    "/recruiters/profile/me"
  );

  return response.data;
};
export const updateRecruiterInfor = (data) => {
  return axiosClient.patch("/recruiters/profile/me", data);
};