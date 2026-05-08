import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  operations, 
  attentionItems, 
  operationalKPIs,
  getStateColor,
  type OperationalState 
} from "@/lib/operations";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Activity,
  Target,
  Zap
} from "lucide-react";

export const Route = createFileRoute("/master")({ component: MasterOperationalView });

function MasterOperationalView() {
  const urgentItems = attentionItems.filter(item => item.type === 'urgent');
  const warningItems = attentionItems.filter(item => item.type === 'warning');
  const totalPending = operations.reduce((sum, op) => {
    return sum + op.states.filter(s => s.state === 'pending').reduce((s, state) => s + state.count, 0);
  }, 0);
  const totalCritical = operations.reduce((sum, op) => {
    return sum + op.states.filter(s => s.state === 'critical').reduce((s, state) => s + state.count, 0);
  }, 0);
  const totalBlocked = operations.reduce((sum, op) => {
    return sum + op.states.filter(s => s.state === 'blocked').reduce((s, state) => s + state.count, 0);
  }, 0);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Master Operational View</h1>
            </div>
            <p className="text-muted-foreground mt-1">Single source of truth for all operations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Target className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <Zap className="h-4 w-4 mr-2" />
              Take Action
            </Button>
          </div>
        </div>

        {/* System Health Overview */}
        <Card className="border-border/60 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-base">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Pending Actions</div>
                <div className="text-3xl font-bold">{totalPending}</div>
                <div className="text-xs text-muted-foreground mt-1">Requires attention</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Critical Issues</div>
                <div className="text-3xl font-bold text-red-600">{totalCritical}</div>
                <div className="text-xs text-muted-foreground mt-1">Immediate action needed</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Blocked Workflows</div>
                <div className="text-3xl font-bold text-orange-600">{totalBlocked}</div>
                <div className="text-xs text-muted-foreground mt-1">Awaiting resolution</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Overall Health</div>
                <div className="text-3xl font-bold text-green-600">87%</div>
                <div className="text-xs text-muted-foreground mt-1">System operational</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executive KPIs */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Executive Overview</h2>
          <div className="grid gap-4 md:grid-cols-5">
            {operationalKPIs.map((kpi) => (
              <Card key={kpi.id} className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {kpi.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{kpi.value}</span>
                    <div className={`flex items-center gap-1 text-xs ${
                      kpi.trend === 'positive' ? 'text-green-600' : 
                      kpi.trend === 'negative' ? 'text-red-600' : 
                      'text-muted-foreground'
                    }`}>
                      {kpi.direction === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {kpi.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Critical Alerts */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold">Critical Alerts</h2>
            <Badge variant="destructive">{urgentItems.length} Urgent</Badge>
          </div>
          
          {urgentItems.length > 0 && (
            <div className="space-y-3">
              {urgentItems.map((item) => (
                <Card key={item.id} className="border-red-500/30 bg-red-50/50 dark:bg-red-950/10">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          {item.entity && (
                            <Badge variant="outline" className="text-xs">{item.entity}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        {item.due && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                            Due {item.due}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="destructive" className="shrink-0">Critical</Badge>
                        <Button size="sm" className="shrink-0">
                          {item.action}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Operations Status Matrix */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Operations Status</h2>
          <Card className="border-border/60">
            <CardContent className="p-0">
              <div className="divide-y">
                {operations.map((operation) => (
                  <Link key={operation.id} to={`/operations/${operation.id}`}>
                    <div className="flex items-center gap-4 p-4 hover:bg-accent transition-colors">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${operation.color}20` }}
                      >
                        <operation.icon className="h-5 w-5" style={{ color: operation.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{operation.name}</h3>
                          {operation.priority === 'urgent' && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{operation.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {operation.states.map((state) => (
                          <div 
                            key={state.state}
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                            style={{ 
                              backgroundColor: `${getStateColor(state.state)}15`,
                              color: getStateColor(state.state)
                            }}
                          >
                            {state.state === 'healthy' && <CheckCircle className="h-3 w-3" />}
                            {state.state === 'blocked' && <XCircle className="h-3 w-3" />}
                            {state.state === 'pending' && <Clock className="h-3 w-3" />}
                            {state.state === 'delayed' && <Clock className="h-3 w-3" />}
                            {state.state === 'failed' && <XCircle className="h-3 w-3" />}
                            {state.state === 'critical' && <AlertTriangle className="h-3 w-3" />}
                            <span className="capitalize">{state.state}</span>
                            <span className="font-bold">{state.count}</span>
                          </div>
                        ))}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-3 md:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Zap className="h-5 w-5" />
              <span className="text-sm font-medium">Execute Action</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Target className="h-5 w-5" />
              <span className="text-sm font-medium">View Targets</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Activity className="h-5 w-5" />
              <span className="text-sm font-medium">System Status</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Analytics</span>
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
