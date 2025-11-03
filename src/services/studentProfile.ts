// app/services/studentService.ts
import api from "../api/axiosInstance";

export const getStudentProfile = async (regNo: string) => {
  const response = await api.get(`/student/profile/${regNo}`);
  return response.data;
};

export const getStudentTransactions = async (regNo: string, page = 1, pageSize = 10) => {
  const response = await api.get(`/student/student-transaction/${regNo}`, {
    params: { page, pageSize },
  });
  return response.data;
};
