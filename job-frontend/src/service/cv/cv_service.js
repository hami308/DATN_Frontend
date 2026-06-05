import axiosClient from "../api";
import { getPublicFileUrl } from "../storage/public_file_upload";

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
  return getPublicFileUrl(filePath);
};

export const getCVDisplayName = (cv) => {
  return cv?.original_name?.trim() || "CV ứng viên.pdf";
};
