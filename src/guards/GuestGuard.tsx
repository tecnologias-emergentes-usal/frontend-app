'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface GuestGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * GuestGuard - Protege rutas que solo deben ser accesibles para usuarios no autenticados
 * Redirige a /app/home si el usuario ya está autenticado
*/
export function GuestGuard({ children, redirectTo = '/app/home' }: GuestGuardProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(redirectTo);
    }
  }, [isLoaded, isSignedIn, redirectTo, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isSignedIn) {
    return null;
  }

  // Usuario no autenticado, mostrar contenido
  return <>{children}</>;
}
