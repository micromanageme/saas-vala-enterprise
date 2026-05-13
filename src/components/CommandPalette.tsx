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
  // Element that had focus before the palette opened, so we can restore it on close.
  const lastFocusedRef = useRef<HTMLElement | null>(null);

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

  // Centralized open setter: capture/restore focus around state change.
  const openPalette = (next: boolean) => {
    if (next) {
      if (typeof document !== "undefined") {
        const el = document.activeElement as HTMLElement | null;
        // Don't capture body — that means nothing was focused.
        if (el && el !== document.body) lastFocusedRef.current = el;
      }
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    const off = ui.on(UI_EVENTS.openCommand, () => openPalette(true));
    return () => {
      window.removeEventListener("keydown", onKey);
      off();
    };
  }, [open]);

  // Focus the search input as soon as the dialog opens.
  useEffect(() => {
    if (!open) return;
    setSearchQuery("");
    // Radix Dialog mounts content asynchronously; retry until input exists.
    let attempts = 0;
    const id = window.setInterval(() => {
      attempts += 1;
      const el = inputRef.current;
      if (el) {
        el.focus();
        el.select?.();
        window.clearInterval(id);
      } else if (attempts > 20) {
        window.clearInterval(id);
      }
    }, 25);
    return () => window.clearInterval(id);
  }, [open]);

  // Restore focus to the previously focused element after the dialog closes.
  useEffect(() => {
    if (open) return;
    const target = lastFocusedRef.current;
    if (!target) return;
    // Wait one frame so Radix has finished its own focus restoration first.
    const id = window.setTimeout(() => {
      if (typeof document !== "undefined" && document.contains(target)) {
        target.focus({ preventScroll: true });
      }
      lastFocusedRef.current = null;
    }, 0);
    return () => window.clearTimeout(id);
  }, [open]);

  const handleSelect = (url: string) => {
    setOpen(false);
    // Navigate after the dialog unmounts so focus restoration completes cleanly.
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
