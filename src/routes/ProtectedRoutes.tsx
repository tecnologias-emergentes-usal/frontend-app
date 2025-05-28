import { Route } from "react-router-dom";
import { AuthGuard } from "@/lib/auth";
import { Home } from "@/views/Home";
import { View } from "@/views/View";
import { IconsDemo } from "@/views/IconsDemo";

interface ProtectedRoutesProps {
  theme: "ios" | "material";
  onTheme: (theme: "ios" | "material") => void;
}

export const ProtectedRoutes = ({ theme, onTheme }: ProtectedRoutesProps) => [
  // Protected Routes
  <Route 
    key="home" 
    path="/home" 
    element={
      <AuthGuard>
        <Home theme={theme} onTheme={onTheme} />
      </AuthGuard>
    } 
  />,
  <Route 
    key="view" 
    path="/view" 
    element={
      <AuthGuard>
        <View />
      </AuthGuard>
    } 
  />,
  <Route 
    key="icons" 
    path="/icons" 
    element={
      <AuthGuard>
        <IconsDemo />
      </AuthGuard>
    } 
  />
]; 