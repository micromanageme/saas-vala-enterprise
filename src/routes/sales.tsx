import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkspace } from "@/lib/workspaces";
import { ArrowRight, TrendingUp, Users, ShoppingCart, Store, Repeat } from "lucide-react";

export const Route = createFileRoute("/sales")({
  head: () => ({ meta: [{ title: "Sales Workspace — SaaS Vala" }] }),
  component: SalesWorkspace,
});

function SalesWorkspace() {
  const workspace = getWorkspace("sales");

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{workspace?.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{workspace?.description}</p>
          </div>
        </div>

        {/* Workflow Overview */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sales Workflows</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workspace?.workflows.map((workflow) => (
              <Link key={workflow.id} to={workflow.url} className="group">
                <Card className="border-border/60 hover:border-primary/50 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${workspace?.color}20` }}
                      >
                        <workflow.icon className="h-5 w-5" style={{ color: workspace?.color }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{workflow.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-muted-foreground group-hover:text-primary transition-colors">
                      <span>Open workflow</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Business Flow Visualization */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Business Flow</h2>
          <Card className="border-border/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Leads</div>
                    <div className="text-xs text-muted-foreground">Capture & qualify</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Quotes</div>
                    <div className="text-xs text-muted-foreground">Send proposals</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Orders</div>
                    <div className="text-xs text-muted-foreground">Convert to sales</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Repeat className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Subscriptions</div>
                    <div className="text-xs text-muted-foreground">Recurring revenue</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
