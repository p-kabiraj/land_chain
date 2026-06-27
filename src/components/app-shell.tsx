import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ArrowLeft, Bell, Wallet } from "lucide-react";

function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate({ to: ".." })}
      className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card hover:bg-accent"
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  );
}

export function AppShell({
  children,
  variant = "user",
  title,
  subtitle,
}: {
  children: ReactNode;
  variant?: "user" | "admin";
  title: string;
  subtitle?: string;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-soft">
        <AppSidebar variant={variant} />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur md:px-6">
            <SidebarTrigger />
            <BackButton />
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-base font-bold sm:text-lg">{title}</h1>
              {subtitle && (
                <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs sm:flex">
              <Wallet className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono">0x9F2c...A41b</span>
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card hover:bg-accent">
              <Bell className="h-4 w-4" />
            </button>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
