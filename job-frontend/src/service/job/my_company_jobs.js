import axiosClient from "../api";

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          query.append(key, item);
        }
      });

      return;
    }

    query.append(key, value);
  });

  const queryString = query.toString();

  return queryString ? `?${queryString}` : "";
};

export const getMyCompanyJobsApi = async (filters = {}) => {
  const response = await axiosClient.get(
    `/jobs/me${buildQueryString(filters)}`
  );

  return response.data;
};

export const closeMyCompanyJobApi = async (jobId) => {
  const response = await axiosClient.patch(`/jobs/${jobId}/close`);

  return response.data;
};

export const reopenMyCompanyJobApi = async (jobId) => {
  const response = await axiosClient.patch(`/jobs/${jobId}/reopen`);

  return response.data;
};

export const extendMyCompanyJobApi = async (jobId, expire) => {
  const response = await axiosClient.patch(`/jobs/${jobId}/extend`, {
    expire,
  });

  return response.data;
};
