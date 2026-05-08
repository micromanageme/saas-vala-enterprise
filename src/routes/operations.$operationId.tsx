import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  getOperation, 
  operations, 
  type OperationType,
  type OperationalState,
  getStateColor
} from "@/lib/operations";
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Plus,
  Search
} from "lucide-react";

export const Route = createFileRoute("/operations/$operationId")({ component: OperationHub });

function OperationHub() {
  const { operationId } = Route.useParams();
  const operation = getOperation(operationId as OperationType);

  if (!operation) {
    return (
      <AppShell>
        <div className="max-w-7xl mx-auto py-8">
          <h1 className="text-2xl font-bold">Operation not found</h1>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            Return to Operations Hub
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${operation.color}20` }}
            >
              <operation.icon className="h-6 w-6" style={{ color: operation.color }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{operation.name}</h1>
              <p className="text-muted-foreground mt-1">{operation.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New {operation.name.slice(0, -1)}
            </Button>
          </div>
        </div>

        {/* Workflow Visualization */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {operation.workflowSteps.map((step, idx) => (
                <div key={step} className="flex items-center">
                  <div 
                    className="px-4 py-2 rounded-lg border-2 font-medium text-sm whitespace-nowrap"
                    style={{ 
                      borderColor: operation.color,
                      backgroundColor: `${operation.color}10`
                    }}
                  >
                    {step}
                  </div>
                  {idx < operation.workflowSteps.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground mx-2 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Operational States Summary */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {operation.states.map((state) => (
            <Card key={state.state} className="border-border/60">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {state.state === 'healthy' && <CheckCircle className="h-4 w-4" style={{ color: getStateColor(state.state) }} />}
                  {state.state === 'blocked' && <XCircle className="h-4 w-4" style={{ color: getStateColor(state.state) }} />}
                  {state.state === 'pending' && <Clock className="h-4 w-4" style={{ color: getStateColor(state.state) }} />}
                  {state.state === 'delayed' && <Clock className="h-4 w-4" style={{ color: getStateColor(state.state) }} />}
                  {state.state === 'failed' && <XCircle className="h-4 w-4" style={{ color: getStateColor(state.state) }} />}
                  {state.state === 'critical' && <AlertTriangle className="h-4 w-4" style={{ color: getStateColor(state.state) }} />}
                  <span className="text-sm font-medium capitalize">{state.state}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{state.count}</span>
                  {state.trend && (
                    <span className="text-xs text-muted-foreground">
                      {state.trend === 'up' ? '↑' : state.trend === 'down' ? '↓' : '→'}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Items - What needs attention */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Action Required</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Card className="border-orange-500/30 bg-orange-50/50 dark:bg-orange-950/10">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Approval Pending</h3>
                      <Badge variant="destructive" className="text-xs">Urgent</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Quote #QT-2024-0045 requires approval</p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Due 2 hours ago</p>
                  </div>
                  <Button size="sm">
                    Review
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/30 bg-yellow-50/50 dark:bg-yellow-950/10">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Follow Up Required</h3>
                      <Badge className="text-xs bg-yellow-500 text-yellow-950 hover:bg-yellow-600">Warning</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Customer hasn't responded to proposal</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Due tomorrow</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Contact
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <Card className="border-border/60">
            <CardContent className="p-0">
              <div className="divide-y">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-accent transition-colors cursor-pointer">
                    <div 
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: operation.color }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">New {operation.workflowSteps[0]} created</div>
                      <div className="text-sm text-muted-foreground">
                        {operation.workflowSteps[0]} #2024-{String(i).padStart(4, '0')} · {i} hours ago
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">Pending</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
