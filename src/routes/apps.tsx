import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { getAccessibleApps } from "@/lib/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Grid3x3, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

export const Route = createFileRoute("/apps")({ component: AppsPage });

function AppsPage() {
  const [q, setQ] = useState("");
  const { roles } = useAuth();
  const accessibleApps = getAccessibleApps(roles);
  const filtered = accessibleApps.filter(
    (app) => !q || app.name.toLowerCase().includes(q.toLowerCase()) || app.description.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 py-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Grid3x3 className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Apps</h1>
              <Badge variant="outline" className="border-primary/40 text-primary">{accessibleApps.length} apps</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Choose an application to work with</p>
          </div>
          <div className="relative w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search apps…" className="pl-9 bg-input/50" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((app) => (
            <Link key={app.id} to={`/apps/${app.id}`} className="group">
              <div className="p-6 border rounded-lg hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg shrink-0"
                    style={{ backgroundColor: `${app.color}20` }}
                  >
                    <app.icon className="h-6 w-6" style={{ color: app.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{app.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{app.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  <span>Open app</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
