import axiosClient from "../api";

export const getMyRecommendedJobsApi = async () => {
  return await axiosClient.get("/candidate/recommended-jobs");
};
