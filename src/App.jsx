import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UsersList from "./components/Users/UsersList";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import UserDetails from "./components/Users/UserDetails";
import TokenManager from "./components/Tokens/TokenManager";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GitLabProjectsList from "./components/Gitlab/GitLabProjectsList";
import GitLabProjectDetails from "./components/Gitlab/GitLabProjectDetails";
import GitLabMergeRequestDetails from "./components/Gitlab/GitLabMergeRequestDetails";
import GitHubReposList from "./components/Github/GitHubReposList";
import GitHubRepoDetails from "./components/Github/GitHubRepoDetails";
import GitHubPRDetails from "./components/Github/GitHubPRDetails";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Public route for login page */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route element={<MainLayout />}>
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UsersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id"
              element={
                <ProtectedRoute>
                  <UserDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tokens"
              element={
                <ProtectedRoute>
                  <TokenManager />
                </ProtectedRoute>
              }
            />

            <Route
              path="/gitlab"
              element={
                <ProtectedRoute>
                  <GitLabProjectsList />
                </ProtectedRoute>
              }
            />

            <Route
      path="/gitlab/projects/:projectId"
      element={
        <ProtectedRoute>
          <GitLabProjectDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path="/gitlab/projects/:projectId/mr/:mrIid"
      element={
        <ProtectedRoute>
          <GitLabMergeRequestDetails />
        </ProtectedRoute>
      }
    />

    <Route
          path="/github"
          element={
            <ProtectedRoute>
              <GitHubReposList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/github/repos/:repoId"
          element={
            <ProtectedRoute>
              <GitHubRepoDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/github/repos/:repoId/pr/:prNumber"
          element={
            <ProtectedRoute>
              <GitHubPRDetails />
            </ProtectedRoute>
          }
        />




            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <div>Not Found</div>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </>
  );
};

export default App;
