import { Navigate } from "react-router-dom";

const RoleGuard = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");

  console.log("RoleGuard check → role:", role, "allowed:", allowedRoles);

  if (!token) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default RoleGuard;
