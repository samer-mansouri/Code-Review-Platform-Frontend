import axiosInstance from "./axiosInstance";

const tokenService = {
  // GitLab Tokens
  getGitlabTokens: async () => {
    try {
      const res = await axiosInstance.get("/api/gitlab-token/");
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  addGitlabToken: async (data) => {
    try {
      const res = await axiosInstance.post("/api/gitlab-token/", data);
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  deleteGitlabToken: async (tokenId) => {
    try {
      const res = await axiosInstance.delete(`/api/gitlab-token/${tokenId}`);
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  // GitHub Tokens
  getGithubTokens: async () => {
    try {
      const res = await axiosInstance.get("/api/github-token/");
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  addGithubToken: async (data) => {
    try {
      const res = await axiosInstance.post("/api/github-token/", data);
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  deleteGithubToken: async (tokenId) => {
    try {
      const res = await axiosInstance.delete(`/api/github-token/${tokenId}`);
      return res.data;
    } catch (err) {
      return Promise.reject(err);
    }
  },
};

export default tokenService;
