import { ReactNode } from "react";
import {
  Page,
  Block,
} from "konsta/react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Page className="flex flex-col min-h-screen bg-background">
      <Block className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </Block>
    </Page>
  );
} 