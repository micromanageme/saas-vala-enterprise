import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { getWorkspace } from "@/lib/workspaces";
import { ArrowRight, User, Network, DollarSign, Clock } from "lucide-react";

export const Route = createFileRoute("/people")({
  head: () => ({ meta: [{ title: "People Workspace — SaaS Vala" }] }),
  component: PeopleWorkspace,
});

function PeopleWorkspace() {
  const workspace = getWorkspace("people");

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{workspace?.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{workspace?.description}</p>
        </div>

        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">People Workflows</h2>
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
                    <Network className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Recruitment</div>
                    <div className="text-xs text-muted-foreground">Hiring pipeline</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Onboarding</div>
                    <div className="text-xs text-muted-foreground">Employee setup</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Attendance</div>
                    <div className="text-xs text-muted-foreground">Time tracking</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Payroll</div>
                    <div className="text-xs text-muted-foreground">Compensation</div>
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
