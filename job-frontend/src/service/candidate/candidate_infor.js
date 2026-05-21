import axiosClient, { BASE_URL } from "../api";

export const getCandidateInfor = async () => {
  return await axiosClient.get("/candidate/me");
};

export const getCandidateDetailApi = async (candidateId) => {
  const response = await axiosClient.get(`/candidate/${candidateId}`);

  return response.data;
};

export const updateCandidateInfor = async (data) => {
  return await axiosClient.put("/candidate/me", data);
};

export const getCandidateFileUrl = (filePath) => {
  if (!filePath) return null;

  if (filePath.startsWith("http")) {
    return filePath;
  }

  const fileBaseUrl = BASE_URL.replace("/api", "");

  return `${fileBaseUrl}${filePath}`;
};
