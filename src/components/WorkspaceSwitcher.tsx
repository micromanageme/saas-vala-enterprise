import { Building, Check, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface Workspace {
  id: string;
  name: string;
  region?: string;
}

export function WorkspaceSwitcher() {
  const [active, setActive] = useState<Workspace>({ id: "default", name: "SaaS Vala HQ", region: "Global" });

  const { data: companiesData, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/admin/companies");
        if (response.ok) {
          const data = await response.json();
          return data.companies || [];
        }
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
      return [];
    },
  });

  const workspaces: Workspace[] = companiesData?.length > 0
    ? companiesData.map((c: any) => ({
        id: c.id,
        name: c.name,
        region: c.domain || "Global",
      }))
    : [
        { id: "default", name: "SaaS Vala HQ", region: "Global" },
        { id: "india", name: "Vala India", region: "APAC" },
        { id: "usa", name: "Vala USA", region: "Americas" },
        { id: "europe", name: "Vala Europe", region: "EMEA" },
      ];

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
        {isLoading ? (
          <div className="px-2 py-4 text-xs text-muted-foreground text-center">Loading...</div>
        ) : (
          workspaces.map((w) => (
            <DropdownMenuItem key={w.id} onClick={() => setActive(w)} className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded gradient-primary"><Building className="h-3.5 w-3.5 text-primary-foreground" /></div>
              <div className="flex-1">
                <div className="text-sm">{w.name}</div>
                <div className="text-[10px] text-muted-foreground">{w.region}</div>
              </div>
              {active.id === w.id && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem><Plus className="h-4 w-4 mr-2" />New workspace</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
