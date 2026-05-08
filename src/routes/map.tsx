import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apps, getModulesForApp, workflowConnections } from "@/lib/navigation";
import { ArrowRight, Layers, Network } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

export const Route = createFileRoute("/map")({ component: SystemMap });

function SystemMap() {
  const { roles } = useAuth();
  const accessibleApps = apps.filter(app => !app.infrastructureOnly || roles.some(r => ['admin', 'super_admin'].includes(r)));

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8 py-8">
        <div>
          <div className="flex items-center gap-2">
            <Network className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">System Map</h1>
          </div>
          <p className="text-muted-foreground mt-1">Visual overview of the enterprise system architecture</p>
        </div>

        {/* Business Flow Visualization */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Business Workflows</h2>
          <Card className="border-border/60">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                {workflowConnections.map((conn, idx) => {
                  const fromApp = accessibleApps.find(app => {
                    const modules = getModulesForApp(app.id, roles);
                    return modules.some(m => m.id === conn.fromModule);
                  });
                  const toApp = accessibleApps.find(app => {
                    const modules = getModulesForApp(app.id, roles);
                    return modules.some(m => m.id === conn.toModule);
                  });
                  
                  if (!fromApp || !toApp) return null;
                  
                  return (
                    <div key={`${conn.fromModule}-${conn.toModule}`} className="flex items-center gap-2">
                      <div 
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                        style={{ borderColor: fromApp.color }}
                      >
                        <div className="h-3 w-3 rounded" style={{ backgroundColor: fromApp.color }} />
                        <span className="text-sm font-medium">{conn.fromModule}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div 
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                        style={{ borderColor: toApp.color }}
                      >
                        <div className="h-3 w-3 rounded" style={{ backgroundColor: toApp.color }} />
                        <span className="text-sm font-medium">{conn.toModule}</span>
                      </div>
                      {idx < workflowConnections.length - 1 && <span className="text-xs text-muted-foreground">·</span>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* App Architecture */}
        <section>
          <h2 className="text-lg font-semibold mb-4">App Architecture</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accessibleApps.map((app) => {
              const appModules = getModulesForApp(app.id, roles);
              
              return (
                <Link key={app.id} to={`/apps/${app.id}`} className="group">
                  <Card className="border-border/60 hover:border-primary/50 transition-colors h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${app.color}20` }}
                        >
                          <app.icon className="h-5 w-5" style={{ color: app.color }} />
                        </div>
                        <CardTitle className="text-base">{app.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{app.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {appModules.map((module) => (
                          <div 
                            key={module.id}
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                            style={{ backgroundColor: `${app.color}15`, color: app.color }}
                          >
                            <module.icon className="h-3 w-3" />
                            <span>{module.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* System Layers */}
        <section>
          <h2 className="text-lg font-semibold mb-4">System Layers</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Operational Layer</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Day-to-day business operations</p>
                <div className="space-y-2">
                  {['Sales', 'Finance', 'Operations', 'People'].map((item) => (
                    <div key={item} className="text-sm flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Intelligence Layer</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Analytics and insights</p>
                <div className="space-y-2">
                  {['Dashboard', 'Reports', 'Analytics'].map((item) => (
                    <div key={item} className="text-sm flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {roles.some(r => ['admin', 'super_admin'].includes(r)) && (
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Infrastructure Layer</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">System configuration</p>
                  <div className="space-y-2">
                    {['Platform', 'Admin', 'Settings', 'Security'].map((item) => (
                      <div key={item} className="text-sm flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
