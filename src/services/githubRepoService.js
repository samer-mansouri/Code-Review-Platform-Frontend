import axiosInstance from "./axiosInstance";

const githubRepoService = {
  add: (data) => axiosInstance.post("/api/github-repo/", data).then(res => res.data),

  getAllRepos: () => axiosInstance.get("/api/github-repo/all").then(res => res.data),

  syncCommits: (repoId) => axiosInstance.post(`/api/github-repo/${repoId}/commits/save`),

  syncPullRequests: (repoId) => axiosInstance.post(`/api/github-repo/${repoId}/pull-requests/full/save`),

  getPullRequests: (repoId) =>
    axiosInstance.get(`/api/github-repo/${repoId}/pulls`).then(res => res.data),

  getPullRequestDetails: (repoId, number) =>
    axiosInstance.get(`/api/github-repo/${repoId}/pull/${number}`).then(res => res.data),
};

export default githubRepoService;
