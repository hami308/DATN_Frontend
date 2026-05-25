import axiosClient from "../api";

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    query.append(key, value);
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
};

export const getRecruiterStatisticsApi = async (filters = {}) => {
  const response = await axiosClient.get(
    `/recruiters/statistics${buildQueryString(filters)}`
  );

  return response.data;
};
