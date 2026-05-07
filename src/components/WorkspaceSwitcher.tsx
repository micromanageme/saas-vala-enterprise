import { Building, Check, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";

const workspaces = [
  { name: "SaaS Vala HQ", region: "Global" },
  { name: "Vala India", region: "APAC" },
  { name: "Vala USA", region: "Americas" },
  { name: "Vala Europe", region: "EMEA" },
];

export function WorkspaceSwitcher() {
  const [active, setActive] = useState(workspaces[0]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-xs">
          <div className="grid h-5 w-5 place-items-center rounded gradient-primary"><Building className="h-3 w-3 text-primary-foreground" /></div>
          {active.name}
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 glass">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((w) => (
          <DropdownMenuItem key={w.name} onClick={() => setActive(w)} className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded gradient-primary"><Building className="h-3.5 w-3.5 text-primary-foreground" /></div>
            <div className="flex-1">
              <div className="text-sm">{w.name}</div>
              <div className="text-[10px] text-muted-foreground">{w.region}</div>
            </div>
            {active.name === w.name && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem><Plus className="h-4 w-4 mr-2" />New workspace</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
