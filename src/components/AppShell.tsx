import { ReactNode } from "react";
import { Search, Command, Plus } from "lucide-react";
import { useRouterState, Link } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { modules } from "@/lib/modules";
import { AuroraBackground } from "./AuroraBackground";
import { AIAssistant } from "./AIAssistant";
import { NotificationDrawer } from "./NotificationDrawer";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = modules.find((m) => pathname === m.url || pathname.startsWith(m.url + "/"));

  return (
    <SidebarProvider>
      <AuroraBackground />
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 glass px-4">
            <SidebarTrigger />
            <WorkspaceSwitcher />
            {current && (
              <nav className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="opacity-50">/</span>
                <span>{current.group}</span>
                <span className="opacity-50">/</span>
                <span className="text-foreground font-medium">{current.title}</span>
              </nav>
            )}
            <div className="relative ml-auto hidden md:block w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Spotlight search…" className="pl-9 pr-12 h-9 bg-input/50" />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>
            <NotificationDrawer />
            <Link to="/profile" className="relative">
              <Avatar className="h-8 w-8 ring-2 ring-primary/40 hover:ring-primary transition">
                <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-bold">SV</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-background" />
            </Link>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in pb-24">{children}</main>

          <button
            className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full gradient-primary text-primary-foreground shadow-glow hover:scale-110 transition-transform"
            aria-label="Quick action"
          >
            <Plus className="h-6 w-6" />
          </button>
          <AIAssistant />
        </div>
      </div>
    </SidebarProvider>
  );
}
