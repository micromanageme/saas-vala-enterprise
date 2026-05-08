import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ChevronRight } from "lucide-react";
import { getApp, getModulesForApp, workflowConnections } from "@/lib/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

export const Route = createFileRoute("/apps/$appId")({
  component: AppView,
});

function AppView() {
  const { appId } = Route.useParams();
  const { roles } = useAuth();
  const app = getApp(appId as any);
  const modules = getModulesForApp(appId as any, roles);

  if (!app) {
    return <div>App not found</div>;
  }

  // Get workflow connections for this app's modules
  const appWorkflowConnections = workflowConnections.filter(conn =>
    modules.some(m => m.id === conn.fromModule) || modules.some(m => m.id === conn.toModule)
  );

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/apps" className="hover:text-foreground">Apps</Link>
          <span>/</span>
          <span className="text-foreground">{app.name}</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">{app.name}</h1>
          <p className="text-muted-foreground mt-1">{app.description}</p>
        </div>

        {/* Visual Workflow Connections */}
        {appWorkflowConnections.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Workflow Flow</h2>
            <Card className="border-border/60">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-4">
                  {appWorkflowConnections.map((conn, idx) => {
                    const fromModule = modules.find(m => m.id === conn.fromModule);
                    const toModule = modules.find(m => m.id === conn.toModule);
                    if (!fromModule || !toModule) return null;
                    
                    return (
                      <div key={`${conn.fromModule}-${conn.toModule}`} className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                          <fromModule.icon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{fromModule.name}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                          <toModule.icon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{toModule.name}</span>
                        </div>
                        {idx < appWorkflowConnections.length - 1 && <span className="text-xs text-muted-foreground">·</span>}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        <section>
          <h2 className="text-lg font-semibold mb-4">Modules</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {modules.map((module) => (
              <Link key={module.id} to={`/apps/${appId}/${module.id}`} className="group">
                <Card className="border-border/60 hover:border-primary/50 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <module.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{module.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      <span>Open module</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
