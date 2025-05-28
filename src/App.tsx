import { BrowserRouter, Routes } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { App } from "konsta/react";
import { AuthProvider } from "@/lib/auth";
import { AuthRoutes, ProtectedRoutes } from "@/routes";

export default function Root() {
  const [theme, setTheme] = useState<"ios" | "material">("material");

  useLayoutEffect(() => {
    if (window.location.href.includes("safe-areas")) {
      const html = document.documentElement;

      if (html) {
        html.style.setProperty(
          "--k-safe-area-top",
          theme === "ios" ? "44px" : "24px"
        );

        html.style.setProperty("--k-safe-area-bottom", "34px");
      }
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <App safeAreas theme={theme}>
          <Routes>
            {AuthRoutes}
            {ProtectedRoutes({ theme, onTheme: setTheme })}
          </Routes>
        </App>
      </AuthProvider>
    </BrowserRouter>
  );
}
