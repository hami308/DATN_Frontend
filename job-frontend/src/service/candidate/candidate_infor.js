import axiosClient from "../api";
import { getPublicFileUrl } from "../storage/public_file_upload";

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
  return getPublicFileUrl(filePath);
};
