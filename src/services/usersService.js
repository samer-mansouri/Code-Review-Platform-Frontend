import axiosInstance from "./axiosInstance";

const usersService = {
  // Get all users (admin only)
  getAll: () =>
    axiosInstance.get("/api/admin/users").then((res) => res.data.users),

  // Create new user (admin only)
  create: (data) =>
    axiosInstance.post("/api/admin/users", data).then((res) => res.data),

  // Delete a user by ID (admin only)
  remove: (userId) =>
    axiosInstance.delete(`/api/admin/users/${userId}`).then((res) => res.data),

  // Update user by ID (admin only)
  update: (userId, data) =>
    axiosInstance.put(`/api/admin/users/${userId}`, data).then((res) => res.data),
};

export default usersService;
