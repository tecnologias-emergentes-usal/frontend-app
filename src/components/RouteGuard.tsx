'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';

const publicRoutes = ['/auth/welcome', '/auth/login', '/auth/register'];

export function RouteGuard({ children }: { children: ReactNode }) {
  const { isLoaded, userId } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const isPublic = publicRoutes.includes(pathname);
    if (!isPublic && !userId) {
      router.replace('/auth/welcome');
    }
  }, [isLoaded, userId, pathname, router]);

  return <>{children}</>;
}
