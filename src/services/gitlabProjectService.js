import axiosInstance from "./axiosInstance";

const gitlabProjectService = {
  // Add GitLab project
  add: async (data) => {
    try {
      const response = await axiosInstance.post("/api/gitlab-project/", data);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  // Get GitLab projects for current user
  getUserProjects: async () => {
    try {
      const response = await axiosInstance.get("/api/gitlab-project/");
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  // Get all GitLab projects (admin use)
  getAllProjects: async () => {
    try {
      const response = await axiosInstance.get("/api/gitlab-project/all");
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  // Sync a GitLab project
  sync: async (projectId) => {
    try {
      const res = await axiosInstance.post(`/api/gitlab-project/${projectId}/sync`);
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  // Get merge requests for a project
  getMergeRequests: async (projectId) => {
    try {
      const res = await axiosInstance.get(`/api/gitlab-merge-requests/${projectId}/merge-requests`);
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  // Get details of a specific merge request
  getMergeRequestDetails: async (projectId, iid) => {
    try {
      const res = await axiosInstance.get(`/api/gitlab-merge-requests/${projectId}/merge-request/${iid}`);
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  // ✅ Delete GitLab project (including MRs and commits)
  delete: async (projectId) => {
    try {
      const res = await axiosInstance.delete(`/api/gitlab-project/${projectId}`);
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

export default gitlabProjectService;
