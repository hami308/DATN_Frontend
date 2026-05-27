import { BASE_URL } from "../api";

export const getPublicFileUrl = (filePath) => {
  if (!filePath) return null;

  const cleanPath = String(filePath).trim();

  if (!cleanPath) return null;

  if (
    /^https?:\/\//i.test(cleanPath) ||
    cleanPath.startsWith("data:") ||
    cleanPath.startsWith("blob:")
  ) {
    return cleanPath;
  }

  const fileBaseUrl = BASE_URL.replace("/api", "");
  const normalizedPath = cleanPath.startsWith("/")
    ? cleanPath
    : `/${cleanPath}`;

  return `${fileBaseUrl}${normalizedPath}`;
};
