import { ReactNode } from "react";
import { Bell, Search, Building, ChevronDown, Command, Plus } from "lucide-react";
import { useRouterState, Link } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/lib/modules";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = modules.find((m) => pathname === m.url || pathname.startsWith(m.url + "/"));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border glass px-4">
            <SidebarTrigger />
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <Building className="h-4 w-4" /> SaaS Vala HQ
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
            {current && (
              <nav className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>/</span><span>{current.group}</span><span>/</span>
                <span className="text-foreground font-medium">{current.title}</span>
              </nav>
            )}
            <div className="relative ml-auto hidden md:block w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search…" className="pl-9 pr-12 h-9 bg-input/50" />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                <Command className="h-3 w-3" />K
              </kbd>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -right-1 -top-1 h-4 min-w-4 px-1 text-[10px] gradient-primary border-0">3</Badge>
            </Button>
            <Link to="/profile">
              <Avatar className="h-8 w-8 ring-2 ring-primary/40 hover:ring-primary transition">
                <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-bold">SV</AvatarFallback>
              </Avatar>
            </Link>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in pb-20">{children}</main>

          {/* Floating action button (mobile-friendly) */}
          <button
            className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full gradient-primary text-primary-foreground shadow-glow hover:scale-110 transition-transform"
            aria-label="Quick action"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
    </SidebarProvider>
  );
}
