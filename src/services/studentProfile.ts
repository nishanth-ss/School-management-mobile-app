// app/services/studentService.ts

import { getBaseUrl, loadBaseUrl } from "@/src/api/apiConfig";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

const handleApiError = (error: any, context: string) => {
  let message = "Something went wrong";

  if (axios.isAxiosError(error)) {
    if (error.response) {
      message = error.response.data?.message || `Server error while fetching ${context}`;
      console.error(`❌ [${context}] Server Error:`, error.response.data);
    } else if (error.request) {
      message = `No response from server while fetching ${context}`;
    } else {
      message = `Request setup failed for ${context}`;
    }
  } else {
    message = `Unexpected error while fetching ${context}`;
  }

  // 💥 Show the toast!
  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
    position: "bottom",
  });

  throw new Error(message);
};


export const getStudentProfile = async (regNo: string) => {
  if (!regNo) {
    return;
  }
  try {
    const check = await loadBaseUrl();
    const baseUrl = await getBaseUrl().trim();
    
    const token = await SecureStore.getItemAsync("authToken");
    const url = `${baseUrl}/student/profile/${regNo}`;

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(url, { headers });

    return response.data;
  } catch (error: any) {
    handleApiError(error, "Student Profile");
    throw error; // ✅ This ensures the caller gets an exception
  }
};


export const getStudentTransactions = async (
  regNo: string,
  page = 1,
  pageSize = 10
) => {
  if(!regNo){
    return;
}
  try {
    const baseUrl = getBaseUrl().trim();
    const token = await SecureStore.getItemAsync("authToken");
    const url = `${baseUrl}/student/student-transaction/${regNo}`;

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(url, {
      headers,
      params: { page, pageSize },
    });

    return response.data;
  } catch (error: any) {
    handleApiError(error, "Student Transactions");
  }
};
