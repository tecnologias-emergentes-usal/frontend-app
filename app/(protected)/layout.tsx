import type { ReactNode } from 'react';
import { AuthGuard } from '@/guards';
import { NotificationProvider } from '@/context/NotificationContext';
import { PredictionsNotificationProvider } from '@/context/PredictionsNotificationContext';
import { BarrierProvider } from '@/context/BarrierContext';
import { MainLayout } from '@/layouts/MainLayout';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <NotificationProvider>
        <PredictionsNotificationProvider>
          <BarrierProvider>
            <MainLayout>{children}</MainLayout>
          </BarrierProvider>
        </PredictionsNotificationProvider>
      </NotificationProvider>
    </AuthGuard>
  );
}
