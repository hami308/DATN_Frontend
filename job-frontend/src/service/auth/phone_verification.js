import axiosClient from "../api";

export const requestPhoneOtp = async (phone) => {
  const response = await axiosClient.post("/auth/phone/request-otp", {
    phone,
  });

  return response.data;
};

export const verifyPhoneOtp = async ({ phone, otp }) => {
  const response = await axiosClient.post("/auth/phone/verify-otp", {
    phone,
    otp,
  });

  return response.data;
};
