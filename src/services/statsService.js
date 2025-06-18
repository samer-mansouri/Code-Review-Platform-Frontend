import axiosInstance from "./axiosInstance";

const statsService = {
  // Overview stats for GitHub and GitLab
  getOverview: () =>
    axiosInstance.get("/api/stats/overview").then((res) => res.data),

  // Monthly PR count (GitHub)
  getGitHubPRsMonthly: () =>
    axiosInstance.get("/api/stats/github/pull-requests/monthly").then((res) => res.data),

  // Monthly MR count (GitLab)
  getGitLabMRsMonthly: () =>
    axiosInstance.get("/api/stats/gitlab/merge-requests/monthly").then((res) => res.data),

  // GitHub merge ratio
  getGitHubMergeRatio: () =>
    axiosInstance.get("/api/stats/github/merge-ratio").then((res) => res.data),

  // GitLab merge ratio
  getGitLabMergeRatio: () =>
    axiosInstance.get("/api/stats/gitlab/merge-ratio").then((res) => res.data),
};

export default statsService;
