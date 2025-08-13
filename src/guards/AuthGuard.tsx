import { ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * AuthGuard - Protege rutas que requieren autenticación
 * Redirige a /login si el usuario no está autenticado
 */
export function AuthGuard({ children, redirectTo = '/welcome' }: AuthGuardProps) {
  const { isSignedIn, isLoaded } = useAuth();

  // Mostrar loading mientras se carga la autenticación
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir
  if (!isSignedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  // Usuario autenticado, mostrar contenido
  return <>{children}</>;
}