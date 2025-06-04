import { Route } from "react-router-dom";
import { AuthGuard } from "@/lib/auth";
import { NotificationProvider } from "@/context/NotificationContext";
import { Home } from "@/views/Home";
import { View } from "@/views/View";
import { IconsDemo } from "@/views/IconsDemo";
import { PredictionsNotificationProvider } from "@/context";
import { MainLayout } from "@/layouts/MainLayout";

interface ProtectedRoutesProps {
  theme: "ios" | "material";
  onTheme: (theme: "ios" | "material") => void;
}

// Wrapper component que combina AuthGuard, NotificationProvider y MainLayout
const ProtectedWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthGuard>
      <NotificationProvider>
        <PredictionsNotificationProvider>
          <MainLayout>
            {/* Notification Display - aparece flotante solo cuando hay notificaciones */}
            <div className="fixed top-4 left-4 right-4 z-50 pointer-events-none">
              <div className="pointer-events-auto">
              </div>
            </div>

            {/* Contenido principal */}
            {children}
          </MainLayout>
        </PredictionsNotificationProvider>
      </NotificationProvider>
    </AuthGuard>
  );
};

export const ProtectedRoutes = ({ theme, onTheme }: ProtectedRoutesProps) => [
  // Protected Routes with MainLayout
  <Route
    key="home"
    path="/home"
    element={
      <ProtectedWrapper>
        <Home theme={theme} onTheme={onTheme} />
      </ProtectedWrapper>
    }
  />,
  <Route
    key="view"
    path="/view"
    element={
      <ProtectedWrapper>
        <View />
      </ProtectedWrapper>
    }
  />,
  <Route
    key="icons"
    path="/icons"
    element={
      <ProtectedWrapper>
        <IconsDemo />
      </ProtectedWrapper>
    }
  />
]; 