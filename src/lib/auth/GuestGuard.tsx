import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface GuestGuardProps {
  children: ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You could replace this with a loading spinner component
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
} 