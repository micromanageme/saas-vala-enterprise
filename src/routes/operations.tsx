import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { getWorkspace } from "@/lib/workspaces";
import { ArrowRight, Boxes, Factory, KanbanSquare, Truck } from "lucide-react";

export const Route = createFileRoute("/operations")({
  head: () => ({ meta: [{ title: "Operations Workspace — SaaS Vala" }] }),
  component: OperationsWorkspace,
});

function OperationsWorkspace() {
  const workspace = getWorkspace("operations");

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{workspace?.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{workspace?.description}</p>
        </div>

        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Operations Workflows</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {workspace?.workflows.map((workflow) => (
              <Link key={workflow.id} to={workflow.url} className="group">
                <Card className="border-border/60 hover:border-primary/50 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <workflow.icon className="h-5 w-5 text-primary" />
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

        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Business Flow</h2>
          <Card className="border-border/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Boxes className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Inventory</div>
                    <div className="text-xs text-muted-foreground">Stock management</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Factory className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Manufacturing</div>
                    <div className="text-xs text-muted-foreground">Production</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <KanbanSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Projects</div>
                    <div className="text-xs text-muted-foreground">Task management</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Logistics</div>
                    <div className="text-xs text-muted-foreground">Delivery</div>
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
