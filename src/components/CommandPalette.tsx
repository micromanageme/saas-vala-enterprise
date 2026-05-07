import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { modules, groups } from "@/lib/modules";
import { ui, UI_EVENTS } from "@/lib/ui-bus";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search modules, pages, actions… (⌘K)" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        {groups.map((g) => (
          <CommandGroup key={g} heading={g}>
            {modules.filter((m) => m.group === g).map((m) => (
              <CommandItem
                key={m.url}
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: m.url });
                }}
              >
                <m.icon className="mr-2 h-4 w-4" />
                <span>{m.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">{m.desc}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
