import axiosInstance from "./axiosInstance";
import uploadFileAxiosInstance from "./uploadFileAxiosInstance";

const userDataService = {
  // Fetch current user data
  getProfile: async () => {
    try {
      const response = await axiosInstance.get("/api/auth/me");
      return response.data;
    } catch (error) {
      return Promise.reject(
        error.response?.data?.error || "Failed to fetch user profile"
      );
    }
  },

  // Update user profile (first name, last name, etc.)
  updateProfile: async (data) => {
    try {
      const response = await axiosInstance.put(
        "/api/auth/update-profile",
        data
      );
      return response.data;
    } catch (error) {
      return Promise.reject(
        error.response?.data?.error || "Failed to update profile"
      );
    }
  },

  // Change password (requires old and new password)
  changePassword: async ({ old_password, new_password }) => {
    try {
      const response = await axiosInstance.post("/api/auth/change-password", {
        old_password,
        new_password,
      });
      return response.data;
    } catch (error) {
      return Promise.reject(
        error.response?.data?.error || "Failed to change password"
      );
    }
  },

  updateProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFileAxiosInstance.put(
        "/api/auth/update-profile-picture",
        formData
      );
      return response.data;
    } catch (error) {
      return Promise.reject(
        error.response?.data?.error || "Failed to update profile picture"
      );
    }
  },
};

export default userDataService;
