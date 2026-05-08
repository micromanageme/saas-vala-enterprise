import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { getWorkspace } from "@/lib/workspaces";
import { ArrowRight, Calculator, FileText, Wallet, FileBarChart } from "lucide-react";

export const Route = createFileRoute("/finance")({
  head: () => ({ meta: [{ title: "Finance Workspace — SaaS Vala" }] }),
  component: FinanceWorkspace,
});

function FinanceWorkspace() {
  const workspace = getWorkspace("finance");

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{workspace?.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{workspace?.description}</p>
        </div>

        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Finance Workflows</h2>
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
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Accounting</div>
                    <div className="text-xs text-muted-foreground">Record transactions</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Invoices</div>
                    <div className="text-xs text-muted-foreground">Bill customers</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Payments</div>
                    <div className="text-xs text-muted-foreground">Track revenue</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileBarChart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Reports</div>
                    <div className="text-xs text-muted-foreground">Financial insights</div>
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
