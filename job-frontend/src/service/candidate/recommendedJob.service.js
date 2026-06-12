import axiosClient from "../api";

export const getMyRecommendedJobsApi = async () => {
  return await axiosClient.get("/candidate/recommended-jobs");
};

export const getMyFullPosNegRecommendedJobsApi = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const suffix = queryString ? `?${queryString}` : "";

  return await axiosClient.get(`/candidate/recommended-jobs/full-pos-neg${suffix}`);
};
