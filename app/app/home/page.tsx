'use client';

import { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Home as HomeView } from '@/views/app/Home';

export default function Page() {
  const [theme, setTheme] = useState<'ios' | 'material'>('material');

  return (
    <MainLayout>
      <HomeView theme={theme} onTheme={setTheme} />
    </MainLayout>
  );
}
