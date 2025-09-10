"use client";

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser, SignOutButton } from '@clerk/nextjs';

import { NotificationProvider } from '@/context/NotificationContext';
import { PredictionsNotificationProvider } from '@/context/PredictionsNotificationContext';
import { BarrierProvider } from '@/context/BarrierContext';

import { Home } from 'lucide-react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
  ] as const;

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Usuario';
  const email = user?.primaryEmailAddress?.emailAddress || '';

  // Build dynamic breadcrumbs from the current path
  const segments = pathname.split('/').filter(Boolean)
  const crumbs = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/')
    const label = seg
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
    return { href, label }
  })

  return (
    <NotificationProvider>
      <PredictionsNotificationProvider>
        <BarrierProvider>
          <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.length === 0 ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  crumbs.map((c, i) => (
                    <span key={c.href} className="contents">
                      {i < crumbs.length - 1 ? (
                        <>
                          <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href={c.href}>{c.label}</BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator className="hidden md:block" />
                        </>
                      ) : (
                        <BreadcrumbItem>
                          <BreadcrumbPage>{c.label}</BreadcrumbPage>
                        </BreadcrumbItem>
                      )}
                    </span>
                  ))
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4">
            <ThemeTogglerButton variant="ghost" size="icon" aria-label="Cambiar tema" />
          </div>
        </header>
        <main className="flex flex-1 flex-col overflow-hidden p-4">
        {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
        </BarrierProvider>
      </PredictionsNotificationProvider>
    </NotificationProvider>
  );
}
