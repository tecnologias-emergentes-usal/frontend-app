import { Route, Navigate } from "react-router-dom";
import { Welcome, Login, Register } from "@/views/auth";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Outlet } from "react-router-dom";
import { GuestGuard } from "@/guards";

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