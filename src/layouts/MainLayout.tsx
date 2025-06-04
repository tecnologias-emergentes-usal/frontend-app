import { ReactNode } from "react";
import {
  Page,
  Toolbar,
  Link,
} from "konsta/react";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeIcon, EyeOpenIcon, GearIcon } from "@radix-ui/react-icons";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

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
    },
    {
      path: "/icons",
      icon: GearIcon,
      label: "Icons",
    },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <Page className="pb-safe">
      {/* Main content area - increased bottom padding */}
      <div className="flex-1 overflow-y-auto pb-20">
        {children}
      </div>

      {/* Bottom Navigation Dock - increased height and padding */}
      <Toolbar
        className="bottom-0 fixed left-0 w-full bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 pb-safe h-16"
      >
        {navigationItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = isActivePath(item.path);
          
          return (
            <div key={item.path} className="flex-1 flex items-center justify-center relative h-full">
              <Link
                toolbar
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center py-1 px-4 min-w-0 transition-colors h-full ${isActive
                    ? "text-primary"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
              >
                <IconComponent
                  className={`w-5 h-5 mb-1 ${isActive
                      ? "text-primary"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                />
                <span className="text-xs font-medium truncate leading-tight">{item.label}</span>
              </Link>
              
              {/* Divider - don't show after last item */}
              {index < navigationItems.length - 1 && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-10 bg-gray-200 dark:bg-gray-700" />
              )}
            </div>
          );
        })}
      </Toolbar>
    </Page>
  );
} 