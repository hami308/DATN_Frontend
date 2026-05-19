import axiosClient, { BASE_URL } from "../api";

export const getMyCVsApi = async () => {
  return await axiosClient.get("/cvs/me");
};

export const uploadMyCVApi = async (file) => {
  const formData = new FormData();

  formData.append("cv", file);

  return await axiosClient.post("/cvs/me", formData);
};

export const deleteMyCVApi = async (cvId) => {
  return await axiosClient.delete(`/cvs/${cvId}`);
};

export const setDefaultCVApi = async (cvId) => {
  return await axiosClient.patch(`/cvs/${cvId}/default`);
};

export const getCVFileUrl = (filePath) => {
  if (!filePath) return null;

  if (filePath.startsWith("http")) {
    return filePath;
  }

  const fileBaseUrl = BASE_URL.replace("/api", "");

  return `${fileBaseUrl}${filePath}`;
};
