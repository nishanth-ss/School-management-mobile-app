// src/services/paymentService.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { getBaseUrl } from "../api/apiConfig";

// Create Axios instance with dynamic baseURL
const API = axios.create({
  baseURL: getBaseUrl(), // ← Use the correct one
});

// Optional: Update baseURL when it changes (advanced)
export const updateAxiosBaseURL = () => {
  API.defaults.baseURL = getBaseUrl();
};

// Add auth token
API.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createOrder = async (studentId: string, amount: number) => {

  if(!getBaseUrl().includes("localhost")){
    updateAxiosBaseURL();
  }
  try {
    console.log("Calling createOrder with URL:", API.defaults.baseURL + "/payment/create");
    const { data } = await API.post("/payment/create", { studentId, amount });
    console.log("Order created:", data);
    
    return data;
  } catch (e: any) {
    console.error("createOrder failed:", e);
    Toast.show({ type: "error", text1: "Error", text2: "Failed to create order" });
    throw e;
  }
};

export const verifyPayment = async (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  try {
    await API.post("/payment/verify", payload);
  } catch (e: any) {
    console.error("verifyPayment failed:", e);
    Toast.show({ type: "error", text1: "Error", text2: "Payment verification failed" });
    throw e;
  }
};