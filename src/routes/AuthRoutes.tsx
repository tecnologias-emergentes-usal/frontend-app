import { Route, Navigate } from "react-router-dom";
import { GuestGuard } from "@/lib/auth";
import { Welcome } from "@/views/Welcome";
import { Login } from "@/views/Login";
import { Register } from "@/views/Register";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Outlet } from "react-router-dom";

// Layout wrapper with GuestGuard
const AuthLayoutWrapper = () => (
  <GuestGuard>
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  </GuestGuard>
);

export const AuthRoutes = [
  // Default Route
  <Route key="default" path="/" element={<Navigate to="/welcome" replace />} />,
  
  // Auth routes with shared layout
  <Route key="auth" element={<AuthLayoutWrapper />}>
    <Route key="welcome" path="/welcome" element={<Welcome />} />
    <Route key="login" path="/login" element={<Login />} />
    <Route key="register" path="/register" element={<Register />} />
  </Route>
];