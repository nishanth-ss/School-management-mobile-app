import axios from "axios";
import { request } from "../api/api";

export const loginUser = async (register_no) => {
  console.log("Login request:", register_no);
  return await request("user/login", "POST", { username:register_no,password: register_no });
};

export const loginWithOtp = async (register_no, otp) => {
  try {
    console.log("Login with OTP request:", { register_no, otp });
    const response = await request("user/verify", "POST", { 
      username: register_no,
      otp: otp 
    });
    console.log("Login with OTP response:", response);
    return response;
  } catch (error) {
    console.error("Login with OTP error:", error);
    throw error;
  }
};

const LOCATION_API = "https://eduhost.onrender.com/api/location";

export const searchLocation = async (query) => {
  try {
    const res = await axios.get(`${LOCATION_API}?search=${query}`);
    return res.data;
  } catch (error) {
    console.error("Location search error:", error);
    throw error;
  }
};
