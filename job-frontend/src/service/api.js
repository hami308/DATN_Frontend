export const BASE_URL = "http://localhost:3000/api";

const request = async (method, url, data, options = {}) => {
  const token = localStorage.getItem("token");
  const isFormData = data instanceof FormData;

  const headers = {
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    method,
    headers,
    body:
      data !== undefined
        ? isFormData
          ? data
          : JSON.stringify(data)
        : undefined,
  });

  const contentType = response.headers.get("content-type");
  const responseData = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw responseData;
  }

  return {
    data: responseData,
    status: response.status,
    headers: response.headers,
  };
};

const axiosClient = {
  get: (url, options) => request("GET", url, undefined, options),
  post: (url, data, options) => request("POST", url, data, options),
  put: (url, data, options) => request("PUT", url, data, options),
  patch: (url, data, options) => request("PATCH", url, data, options),
  delete: (url, options) => request("DELETE", url, undefined, options),
};

export default axiosClient;
