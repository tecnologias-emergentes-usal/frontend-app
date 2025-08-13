import { ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

interface GuestGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * GuestGuard - Protege rutas que solo deben ser accesibles para usuarios no autenticados
 * Redirige a /home si el usuario ya está autenticado
 */
export function GuestGuard({ children, redirectTo = '/home' }: GuestGuardProps) {
  const { isSignedIn, isLoaded } = useAuth();

  // Mostrar loading mientras se carga la autenticación
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si ya está autenticado, redirigir
  if (isSignedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  // Usuario no autenticado, mostrar contenido
  return <>{children}</>;
}