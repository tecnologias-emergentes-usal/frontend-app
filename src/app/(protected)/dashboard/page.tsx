'use client';

import { useState } from 'react';
import { Home as HomeView } from '@/components/ui/Home';

export default function Page() {
  const [theme, setTheme] = useState<'ios' | 'material'>('material');

  return <HomeView theme={theme} onTheme={setTheme} />;
}

