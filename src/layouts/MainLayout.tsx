'use client';

import { ReactNode } from "react";
import { Page } from "konsta/react";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  EyeOpenIcon,
  GearIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { UserButton, useUser } from "@clerk/nextjs";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const navigationItems = [
    {
      path: "/home",
      icon: HomeIcon,
      label: "Home",
    },
    {
      path: "/view",
      icon: EyeOpenIcon,
      label: "View",
      disabled: true,
    },
    {
      path: "/icons",
      icon: GearIcon,
      label: "Icons",
      disabled: true,
    },
  ];

  const isActivePath = (path: string) => pathname === path;

  const firstName = user?.firstName || "Usuario";

  return (
    <Page className="flex flex-col min-h-screen bg-background pb-safe">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <div className="w-full max-w-md px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 rounded-b-3xl shadow-xl">
          <div className="relative flex items-center">
            {/* User Button - Left */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: "shadow-lg",
                },
              }}
            />

            {/* Greeting - Absolutely centered */}
            <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Hola {firstName} 👋
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ¿Qué hacemos hoy?
                </p>
              </div>
            </div>

            {/* Search Button - Right */}
            <button
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-auto"
              onClick={() => {
                /* TODO: Implement search */
              }}
            >
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content area - centered and with proper spacing */}
      <div className="flex-1 flex justify-center pt-24">
        <div className="w-full max-w-md px-6 py-6">
          {children}
          {/* Spacer to prevent dock overlap */}
          <div className="h-20"></div>
        </div>
      </div>

      {/* Floating Dock Navigation - better contrast */}
      <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pb-safe">
        <div className="bg-white dark:bg-gray-900 backdrop-blur-lg rounded-full shadow-2xl border border-gray-300 dark:border-gray-600 px-6 py-3">
          <div className="flex items-center gap-4">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActivePath(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  disabled={item.disabled}
                  className={`relative p-3 rounded-full transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Page>
  );
}
