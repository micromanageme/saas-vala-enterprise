import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { modules, groups } from "@/lib/modules";
import { useSession, canSeeGroup } from "@/lib/auth";

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const session = useSession();
  const visibleGroups = groups.filter((g) => canSeeGroup(session?.role, g));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-gradient">SaaS Vala</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Enterprise Suite</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {visibleGroups.map((g) => (
          <SidebarGroup key={g}>
            <SidebarGroupLabel>{g}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {modules.filter((m) => m.group === g).map((m) => {
                  const active = pathname === m.url || pathname.startsWith(m.url + "/");
                  return (
                    <SidebarMenuItem key={m.url}>
                      <SidebarMenuButton asChild isActive={active} tooltip={m.title}>
                        <Link to={m.url}>
                          <m.icon className="h-4 w-4" />
                          <span>{m.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-2 py-2 text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          v1.0 · © SaaS Vala
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
