import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md md:max-w-lg">
          {children}
        </div>
      </div>
    </div>
  );
}