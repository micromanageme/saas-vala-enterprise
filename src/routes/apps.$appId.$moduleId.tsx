import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { getApp, getModulesForApp, getActionsForModule } from "@/lib/navigation";

export const Route = createFileRoute("/apps/$appId/$moduleId")({
  component: ModuleView,
});

function ModuleView() {
  const { appId, moduleId } = Route.useParams();
  const app = getApp(appId as any);
  const modules = getModulesForApp(appId as any);
  const module = modules.find(m => m.id === moduleId);
  const actions = getActionsForModule(moduleId);

  if (!app || !module) {
    return <div>Module not found</div>;
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/apps" className="hover:text-foreground">Apps</Link>
          <span>/</span>
          <Link to={`/apps/${appId}`} className="hover:text-foreground">{app.name}</Link>
          <span>/</span>
          <span className="text-foreground">{module.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{module.name}</h1>
            <p className="text-muted-foreground mt-1">{module.description}</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>New</span>
          </Button>
        </div>

        {/* Quick Actions */}
        {actions.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid gap-3 md:grid-cols-4">
              {actions.map((action) => (
                <button key={action.id} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors text-left">
                  <action.icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium text-sm">{action.name}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Module Content */}
        <Card>
          <CardHeader>
            <CardTitle>Module Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is the {module.name} module within the {app.name} app.
              Module-specific content would be rendered here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
