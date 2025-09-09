'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth, redirectToSignIn } from '@clerk/nextjs';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * AuthGuard - Protege rutas que requieren autenticación
 * Redirige a /auth/welcome si el usuario no está autenticado
 */
export function AuthGuard({ children, redirectTo = '/auth/welcome' }: AuthGuardProps) {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirectToSignIn({ redirectUrl: redirectTo });
    }
  }, [isLoaded, isSignedIn, redirectTo]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Usuario autenticado, mostrar contenido
  return <>{children}</>;
}
