import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, Home, Activity, Target } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { operations } from "@/lib/operations";
import { SYSTEM_IDENTITY } from "@/lib/system-identity";

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold">SaaS Vala</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{SYSTEM_IDENTITY}</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Command Center</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/'}>
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/master'}>
                  <Link to="/master">
                    <Activity className="h-4 w-4" />
                    <span>Operations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operations.slice(0, 4).map((operation) => (
                <SidebarMenuItem key={operation.id}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === `/operations/${operation.id}`}
                    tooltip={operation.name}
                  >
                    <Link to={`/operations/${operation.id}`}>
                      <operation.icon className="h-4 w-4" style={{ color: operation.color }} />
                      <span>{operation.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-2 py-2 text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          {SYSTEM_IDENTITY}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
