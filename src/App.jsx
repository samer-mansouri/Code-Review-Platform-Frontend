import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { protectedRoutes } from "./routes/routeConfig";
import RoleGuard from "./guards/RoleGuard";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { ToastContainer } from "react-toastify";
import RequestResetPage from "./pages/RequestResetPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          <Route
            path="/request-reset"
            element={
              <PublicRoute>
                <RequestResetPage />
              </PublicRoute>
            }
          />

          <Route
            path="/reset/:token"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />

          {/* Unauthorized must be public */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected routes under layout */}
          <Route element={<MainLayout />}>
            {protectedRoutes.map(({ path, element: Component, roles }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute>
                    <RoleGuard allowedRoles={roles}>
                      <Component />
                    </RoleGuard>
                  </ProtectedRoute>
                }
              />
            ))}

            {/* 404 fallback */}
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
