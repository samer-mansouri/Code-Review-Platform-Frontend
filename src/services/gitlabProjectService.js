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

  sync: async (projectId) => {
    try {
      const res = await axiosInstance.post(
        `/api/gitlab-project/${projectId}/sync`
      );
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  getMergeRequests: async (projectId) => {
  return axiosInstance.get(`/api/gitlab-merge-requests/${projectId}/merge-requests`).then(res => res.data);
},

getMergeRequestDetails: async (projectId, iid) => {
  return axiosInstance.get(`/api/gitlab-merge-requests/${projectId}/merge-request/${iid}`).then(res => res.data);
}

};

export default gitlabProjectService;
