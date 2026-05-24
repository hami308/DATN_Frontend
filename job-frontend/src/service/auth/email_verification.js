import axiosClient from "../api";

export const checkEmailRegistered = async (email) => {
  const response = await axiosClient.post("/auth/email/check", {
    email,
  });

  return response.data;
};

export const requestEmailOtp = async (email) => {
  const response = await axiosClient.post("/auth/email/request-otp", {
    email,
  });

  return response.data;
};

export const verifyEmailOtp = async ({ email, otp }) => {
  const response = await axiosClient.post("/auth/email/verify-otp", {
    email,
    otp,
  });

  return response.data;
};
