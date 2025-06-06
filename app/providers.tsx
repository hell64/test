"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { authClient } from "@/lib/auth-client";
import { ThemeProvider } from "next-themes";
import betterAuthLocalizationUA from "@/lib/auth-ua";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthUIProvider
        authClient={authClient}
        navigate={router.push}
        replace={router.replace}
        onSessionChange={() => {
          // Clear router cache (protected routes)
          router.refresh();
        }}
        settingsURL="/dashboard/settings"
        Link={Link}
        localization={betterAuthLocalizationUA}
        settingsFields={["currency"]}
      >
        {children}
      </AuthUIProvider>
    </ThemeProvider>
  );
}
