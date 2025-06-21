// src/routes/routeConfig.js
import UserDetails from "../components/Users/UserDetails";
import TokenManager from "../components/Tokens/TokenManager";
import GitLabProjectsList from "../components/Gitlab/GitLabProjectsList";
import GitLabProjectDetails from "../components/Gitlab/GitLabProjectDetails";
import GitLabMergeRequestDetails from "../components/Gitlab/GitLabMergeRequestDetails";
import GitHubReposList from "../components/Github/GitHubReposList";
import GitHubRepoDetails from "../components/Github/GitHubRepoDetails";
import GitHubPRDetails from "../components/Github/GitHubPRDetails";
import StatsDashboard from "../components/Stats/StatsDashboard";
import UserProfile from "../components/User/UserProfile";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import UsersList from "../components/Users/UsersList";
import AiReviewDetails from "../components/Review/AiReviewDetails";

export const protectedRoutes = [
  {
    path: "/users",
    element: UsersList,
    roles: ["admin"],
  },
  {
    path: "/users/:id",
    element: UserDetails,
    roles: ["admin"],
  },
  {
    path: "/tokens",
    element: TokenManager,
    roles: ["developer"],
  },
  {
    path: "/gitlab",
    element: GitLabProjectsList,
    roles: ["developer"],
  },
  {
    path: "/gitlab/projects/:projectId",
    element: GitLabProjectDetails,
    roles: ["developer"],
  },
  {
    path: "/gitlab/projects/:projectId/mr/:mrIid",
    element: GitLabMergeRequestDetails,
    roles: ["developer"],
  },
  {
    path: "/github",
    element: GitHubReposList,
    roles: ["developer"],
  },
  {
    path: "/github/repos/:repoId",
    element: GitHubRepoDetails,
    roles: ["developer"],
  },
  {
    path: "/github/repos/:repoId/pr/:prNumber",
    element: GitHubPRDetails,
    roles: ["developer"],
  },
  {
    path: "/:source/reviews/:prId",
    element: AiReviewDetails,
    roles: ["developer"],
  },
  {
    path: "/stats",
    element: StatsDashboard,
    roles: ["admin"],
  },
  {
    path: "/profile",
    element: UserProfile,
    roles: ["admin", "developer"],
  },
  {
    path: "/unauthorized",
    element: UnauthorizedPage,
  },
];
