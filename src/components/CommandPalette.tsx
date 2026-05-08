import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { apps, getModulesForApp, getActionsForModule } from "@/lib/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { ui, UI_EVENTS } from "@/lib/ui-bus";
import { Search, Home, Plus, AlertTriangle, CheckCircle2 } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Flatten all modules for search
  const allModules = useMemo(() => {
    return apps.flatMap(app => 
      getModulesForApp(app.id).map(m => ({ ...m, appName: app.name, appColor: app.color }))
    );
  }, []);

  // Flatten all actions for search
  const allActions = useMemo(() => {
    return allModules.flatMap(module =>
      getActionsForModule(module.id).map(a => ({ ...a, moduleName: module.name, appName: module.appName }))
    );
  }, [allModules]);

  // Filter results based on search query
  const filteredApps = useMemo(() => {
    if (!searchQuery) return apps;
    const query = searchQuery.toLowerCase();
    return apps.filter(app => 
      app.name.toLowerCase().includes(query) || 
      app.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredModules = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return allModules.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query) ||
      m.appName.toLowerCase().includes(query)
    );
  }, [searchQuery, allModules]);

  const filteredActions = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return allActions.filter(a =>
      a.name.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query) ||
      a.moduleName.toLowerCase().includes(query)
    );
  }, [searchQuery, allActions]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    const off = ui.on(UI_EVENTS.openCommand, () => setOpen(true));
    return () => { window.removeEventListener("keydown", onKey); off(); };
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    navigate({ to: url });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Search apps, modules, actions… (⌘K)" 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {!searchQuery && (
          <>
            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => handleSelect("/")}>
                <Home className="mr-2 h-4 w-4" />
                <span>Go to My Work</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/apps")}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Browse Apps</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/approvals")}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                <span>Pending Approvals</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("/tasks")}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                <span>My Tasks</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />
          </>
        )}

        {filteredApps.length > 0 && (
          <CommandGroup heading="Apps">
            {filteredApps.map((app) => (
              <CommandItem
                key={app.id}
                onSelect={() => handleSelect(`/apps/${app.id}`)}
              >
                <div 
                  className="mr-2 h-4 w-4 rounded" 
                  style={{ backgroundColor: app.color }}
                />
                <span>{app.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{app.description}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredModules.length > 0 && (
          <>
            {filteredApps.length > 0 && <CommandSeparator />}
            <CommandGroup heading="Modules">
              {filteredModules.map((module) => (
                <CommandItem
                  key={`${module.appName}-${module.id}`}
                  onSelect={() => handleSelect(`/apps/${module.appId}/${module.id}`)}
                >
                  <module.icon className="mr-2 h-4 w-4" />
                  <span>{module.name}</span>
                  <span className="ml-1 text-xs text-muted-foreground">· {module.appName}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {filteredActions.length > 0 && (
          <>
            {(filteredApps.length > 0 || filteredModules.length > 0) && <CommandSeparator />}
            <CommandGroup heading="Actions">
              {filteredActions.map((action) => (
                <CommandItem
                  key={`${action.appName}-${action.moduleName}-${action.id}`}
                  onSelect={() => handleSelect(action.url)}
                >
                  <action.icon className="mr-2 h-4 w-4" />
                  <span>{action.name}</span>
                  <span className="ml-1 text-xs text-muted-foreground">· {action.moduleName}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {searchQuery && filteredApps.length === 0 && filteredModules.length === 0 && filteredActions.length === 0 && (
          <CommandEmpty>
            No apps, modules, or actions found for "{searchQuery}"
          </CommandEmpty>
        )}
      </CommandList>
    </CommandDialog>
  );
}
