import { ReactNode } from "react";
import { Bell, Search, Building, ChevronDown } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function AppShell({ children }: { children: ReactNode }) {
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
            <div className="relative ml-2 hidden flex-1 max-w-md md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search modules, customers, invoices…" className="pl-9 bg-input/50" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -right-1 -top-1 h-4 min-w-4 px-1 text-[10px] gradient-primary border-0">3</Badge>
              </Button>
              <Avatar className="h-8 w-8 ring-2 ring-primary/40">
                <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-bold">SV</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
