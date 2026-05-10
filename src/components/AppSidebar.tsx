import { useMemo, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, Home, Activity, Search, ChevronRight, Crown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { modules, groups } from "@/lib/modules";
import { SYSTEM_IDENTITY } from "@/lib/system-identity";

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return modules;
    return modules.filter(
      (m) =>
        m.title.toLowerCase().includes(needle) ||
        m.group.toLowerCase().includes(needle) ||
        m.desc.toLowerCase().includes(needle),
    );
  }, [q]);

  const grouped = useMemo(() => {
    return groups
      .map((g) => ({ group: g, items: filtered.filter((m) => m.group === g) }))
      .filter((g) => g.items.length > 0);
  }, [filtered]);

  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold">SaaS Vala</span>
            <span className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
              {SYSTEM_IDENTITY}
            </span>
          </div>
        </Link>
        {!collapsed && (
          <div className="relative px-2 pb-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter modules…"
              className="h-8 pl-7 text-xs bg-sidebar-accent/30 border-sidebar-border"
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Pinned shortcuts */}
        <SidebarGroup>
          <SidebarGroupLabel>Command Center</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/"}
                  tooltip="Dashboard"
                >
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/super-admin")}
                  tooltip="Super Admin"
                >
                  <Link to="/super-admin">
                    <Crown className="h-4 w-4" />
                    <span>Super Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/master")}
                  tooltip="Operations"
                >
                  <Link to="/master">
                    <Activity className="h-4 w-4" />
                    <span>Operations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* All modules grouped */}
        {grouped.map(({ group, items }) => {
          const groupOpen = items.some((m) => isActive(m.url)) || !!q;
          return (
            <Collapsible
              key={group}
              defaultOpen={groupOpen}
              className="group/collapse"
            >
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between hover:text-foreground">
                    <span>{group}</span>
                    <ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]/collapse:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {items.map((m) => {
                        const Icon = m.icon;
                        const active = isActive(m.url);
                        return (
                          <SidebarMenuItem key={m.url}>
                            <SidebarMenuButton
                              asChild
                              isActive={active}
                              tooltip={m.title}
                            >
                              <Link to={m.url as any}>
                                <Icon className="h-4 w-4" />
                                <span>{m.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}

        {grouped.length === 0 && !collapsed && (
          <div className="px-4 py-6 text-center text-xs text-muted-foreground">
            No modules match "{q}"
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-2 py-2 text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          {SYSTEM_IDENTITY} · {modules.length} modules
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
