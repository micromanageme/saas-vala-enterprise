import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  getEntityContext, 
  getStatusColor, 
  getStatusIcon,
  type EntityType 
} from "@/lib/entities";
import { ArrowRight, TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";

interface EntityContextViewProps {
  entityId: string;
  entityType: EntityType;
}

export function EntityContextView({ entityId, entityType }: EntityContextViewProps) {
  const context = getEntityContext(entityId, entityType);

  return (
    <div className="space-y-6">
      {/* Entity Header */}
      <Card className="border-border/60">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <context.entity.icon className="h-5 w-5" />
                <CardTitle className="text-lg">{context.entity.name}</CardTitle>
                <Badge 
                  variant="outline"
                  style={{ 
                    borderColor: getStatusColor(context.entity.status),
                    color: getStatusColor(context.entity.status)
                  }}
                >
                  {(() => {
                    const StatusIcon = getStatusIcon(context.entity.status);
                    return <StatusIcon className="h-3 w-3 mr-1" />;
                  })()}
                  {context.entity.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {entityType.charAt(0).toUpperCase() + entityType.slice(1)} details
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* KPIs Section */}
      <section>
        <h3 className="text-sm font-semibold mb-3">Key Metrics</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {context.kpis.map((kpi, idx) => (
            <Card key={idx} className="border-border/60">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">{kpi.value}</span>
                  {kpi.trend !== 'stable' && (
                    <div className={`flex items-center gap-1 text-xs ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Active Workflow */}
      <section>
        <h3 className="text-sm font-semibold mb-3">Workflow Progress</h3>
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {context.activeWorkflow.map((step, idx) => (
                <div key={step} className="flex items-center">
                  <div className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${
                    idx === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {step}
                  </div>
                  {idx < context.activeWorkflow.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-2 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Pending Actions */}
      <section>
        <h3 className="text-sm font-semibold mb-3">Actions Required</h3>
        <div className="space-y-2">
          {context.pendingActions.map((action, idx) => (
            <Button key={idx} variant="outline" className="w-full justify-start">
              {action}
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          ))}
        </div>
      </section>

      {/* Related Entities - Context-Aware UI */}
      <section>
        <h3 className="text-sm font-semibold mb-3">Related Items</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {context.relatedEntities.map((entity) => {
            const StatusIcon = getStatusIcon(entity.status);
            
            return (
              <Card key={entity.id} className="border-border/60 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <entity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{entity.name}</h4>
                        <Badge 
                          variant="outline" 
                          className="text-xs shrink-0"
                          style={{ 
                            borderColor: getStatusColor(entity.status),
                            color: getStatusColor(entity.status)
                          }}
                        >
                          <StatusIcon className="h-2.5 w-2.5 mr-1" />
                          {entity.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
