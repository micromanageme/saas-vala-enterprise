import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { modules, groups, type ModuleItem } from "@/lib/modules";
import { useSession, canSeeGroup } from "@/lib/auth";
import { ui, UI_EVENTS } from "@/lib/ui-bus";
import { Home, Bell, Settings, ShieldCheck, Crown } from "lucide-react";

const QUICK_ACTIONS = [
  { url: "/", label: "Go Home", icon: Home },
  { url: "/notifications", label: "Notifications", icon: Bell },
  { url: "/settings", label: "Settings", icon: Settings },
  { url: "/audit", label: "Audit Logs", icon: ShieldCheck },
  { url: "/super-admin", label: "Super Admin", icon: Crown, superOnly: true },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const session = useSession();
  const role = session?.role;
  const isSuper = session?.baseRole === "SUPER_ADMIN";
  const inputRef = useRef<HTMLInputElement>(null);

  // Modules visible to this role
  const allowedModules = useMemo<ModuleItem[]>(() => {
    if (!role) return modules;
    return modules.filter((m) => canSeeGroup(role, m.group));
  }, [role]);

  const quickActions = useMemo(
    () => QUICK_ACTIONS.filter((q) => !q.superOnly || isSuper),
    [isSuper],
  );

  // Group modules by category for display, ordered by `groups`
  const grouped = useMemo(() => {
    return groups
      .map((g) => ({
        group: g,
        items: allowedModules.filter((m) => m.group === g),
      }))
      .filter((g) => g.items.length > 0);
  }, [allowedModules]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    const off = ui.on(UI_EVENTS.openCommand, () => setOpen(true));
    return () => {
      window.removeEventListener("keydown", onKey);
      off();
    };
  }, []);

  // Reset search when reopening
  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = (url: string) => {
    setOpen(false);
    // Defer navigation so the dialog unmounts cleanly first
    setTimeout(() => navigate({ to: url as any }), 0);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        ref={inputRef as any}
        placeholder="Search modules, pages or actions…"
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {!searchQuery && (
          <>
            <CommandGroup heading="Quick actions">
              {quickActions.map((q) => (
                <CommandItem
                  key={q.url}
                  value={`quick ${q.label}`}
                  onSelect={() => handleSelect(q.url)}
                >
                  <q.icon className="mr-2 h-4 w-4" />
                  <span>{q.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {grouped.map(({ group, items }, idx) => (
          <div key={group}>
            {idx > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {items.map((m) => {
                const Icon = m.icon;
                return (
                  <CommandItem
                    key={m.url}
                    value={`${m.title} ${m.group} ${m.desc}`}
                    onSelect={() => handleSelect(m.url)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span className="font-medium">{m.title}</span>
                    <span className="ml-2 truncate text-xs text-muted-foreground">
                      {m.desc}
                    </span>
                    <span className="ml-auto pl-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {group}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
