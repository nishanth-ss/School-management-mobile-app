// app/services/authService.ts

import api from "../../app/api/axiosInstance";

export const loginUser = async (register_no: string) => {
  const response = await api.post("/user/login", {
    username: register_no,
    password: register_no,
  });
  return response.data;
};
