import { ReactNode, useState } from "react";
import { Search, Command, Plus, Grid3x3, LogOut, BarChart3, Zap } from "lucide-react";
import { useRouterState, Link, useNavigate } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { modules } from "@/lib/modules";
import { AuroraBackground } from "./AuroraBackground";
import { AIAssistant } from "./AIAssistant";
import { NotificationDrawer } from "./NotificationDrawer";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { QuickCreate } from "./QuickCreate";
import { ShortcutsDialog } from "./ShortcutsDialog";
import { GlobalHotkeys } from "./GlobalHotkeys";
import { PreferencesMenu } from "./PreferencesMenu";
import { ui, UI_EVENTS } from "@/lib/ui-bus";
import { Systray } from "./Systray";
import { Banners } from "./Banners";
import { ActionWizards } from "./ActionWizards";
import { RippleProvider, SaveIndicator, FocusMode, DragUploadOverlay, BackgroundTasks, PresenceAvatars, Walkthrough } from "./Polish";
import { Splash, RouteTracker, CollabCursors } from "./Workspace";
import { useAuth } from "@/lib/hooks/useAuth";
import { AppDrawer } from "./AppDrawer";
import { useViewMode } from "@/lib/view-mode";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { situationalModes, type SituationalMode } from "@/lib/system-identity";
import { LayoutDashboard, ChevronDown, Shield, Target, AlertTriangle } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { roles, user, logout } = useAuth();
  const navigate = useNavigate();
  const current = modules.find((m) => pathname === m.url || pathname.startsWith(m.url + "/"));
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const { viewMode, toggleViewMode } = useViewMode();
  const [currentMode, setCurrentMode] = useState<SituationalMode>('operations');

  // Role-aware: hide complex features for basic users
  const showAdvancedFeatures = roles.some(r => ['admin', 'super_admin'].includes(r));

  const getModeIcon = (mode: SituationalMode) => {
    switch (mode) {
      case 'executive': return <LayoutDashboard className="h-4 w-4" />;
      case 'operations': return <Zap className="h-4 w-4" />;
      case 'focus': return <Target className="h-4 w-4" />;
      case 'analytics': return <BarChart3 className="h-4 w-4" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  return (
    <SidebarProvider>
      <Splash />
      <RouteTracker />
      <CollabCursors />
      <AuroraBackground />
      <GlobalHotkeys />
      <QuickCreate />
      <ShortcutsDialog />
      <RippleProvider />
      <DragUploadOverlay />
      <Walkthrough />
      <BackgroundTasks />
      <AppDrawer open={appDrawerOpen} onOpenChange={setAppDrawerOpen} />
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 glass px-4">
            <SidebarTrigger />
            <button
              onClick={() => setAppDrawerOpen(true)}
              className="grid h-8 w-8 place-items-center rounded-md hover:bg-accent transition"
              title="Apps"
            >
              <Grid3x3 className="h-4 w-4 text-foreground" />
            </button>
            {current && (
              <nav className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="opacity-50">/</span>
                <span>{current.group}</span>
                <span className="opacity-50">/</span>
                <span className="text-foreground font-medium">{current.title}</span>
              </nav>
            )}
            <button
              onClick={() => ui.emit(UI_EVENTS.openCommand)}
              className="relative ml-auto hidden md:block w-72 text-left"
              aria-label="Open spotlight search"
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input readOnly placeholder="Search apps, modules, actions… (⌘K)" className="pl-9 pr-12 h-9 bg-input/50 cursor-pointer" />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                <Command className="h-3 w-3" />K
              </kbd>
            </button>
            {showAdvancedFeatures && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    {getModeIcon(currentMode)}
                    <span className="hidden sm:inline">
                      {situationalModes.find(m => m.id === currentMode)?.name}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {situationalModes.map((mode) => (
                    <DropdownMenuItem 
                      key={mode.id}
                      onClick={() => setCurrentMode(mode.id)}
                      className={currentMode === mode.id ? "bg-accent" : ""}
                    >
                      {getModeIcon(mode.id)}
                      <div className="ml-2">
                        <div className="font-medium">{mode.name}</div>
                        <div className="text-xs text-muted-foreground">{mode.description}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleViewMode}
                className="gap-2"
              >
                {viewMode === 'executive' ? <BarChart3 className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                <span className="hidden sm:inline">{viewMode === 'executive' ? 'Executive' : 'Operator'}</span>
              </Button>
            )}
            <PresenceAvatars />
            {showAdvancedFeatures && <SaveIndicator />}
            <Systray />
            {showAdvancedFeatures && <FocusMode />}
            <NotificationDrawer />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative">
                  <Avatar className="h-8 w-8 ring-2 ring-border hover:ring-primary transition">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-background" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">{roles.join(', ')}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in pb-24 space-y-4">
            <Banners />
            {children}
          </main>
          <ActionWizards />
          <AIAssistant />
        </div>
      </div>
    </SidebarProvider>
  );
}
