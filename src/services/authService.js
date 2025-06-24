import axiosInstance from "./axiosInstance";

const authService = {
  // Login a user
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  //refresh users token
  refreshToken: async (refresh) => {
    try {
      const response = await axiosInstance.post("/api/auth/refresh", {
        refresh,
      });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  register: async (data) => {
    try {
      const response = await axiosInstance.post("/api/auth/register", data);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  requestPasswordReset: async (email) => {
    try {
      const res = await axiosInstance.post("/api/auth/request-reset", { email });
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  resetPassword: async (token, password) => {
    try {
      const res = await axiosInstance.post(`/api/auth/reset/${token}`, { password });
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  },
};

export default authService;
