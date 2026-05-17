import axiosClient from "../api";

export const getRecruiterConditions = async () => {
  const response = await axiosClient.get(
    "/recruiters/posting/check"
  );

  return response.data;
};
