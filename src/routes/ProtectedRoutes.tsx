import { Route } from "react-router-dom";
import { NotificationProvider } from "@/context/NotificationContext";
import { Home, IconsDemo } from "@/views/app";
import { PredictionsNotificationProvider } from "@/context";
import { BarrierProvider } from "@/context/BarrierContext";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthGuard } from "@/guards";

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
          <BarrierProvider>
            <MainLayout>
            {/* Notification Display - aparece flotante solo cuando hay notificaciones */}
            <div className="fixed top-4 left-4 right-4 z-50 pointer-events-none">
              <div className="pointer-events-auto">
              </div>
            </div>

            {/* Contenido principal */}
            {children}
            </MainLayout>
          </BarrierProvider>
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
    key="icons"
    path="/icons"
    element={
      <ProtectedWrapper>
        <IconsDemo />
      </ProtectedWrapper>
    }
  />
]; 