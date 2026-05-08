import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  getJourneysRequiringAttention,
  getActiveJourneys,
  type OperationalJourney
} from "@/lib/operational-journey";
import { 
  SYSTEM_IDENTITY,
  SYSTEM_TAGLINE
} from "@/lib/system-identity";
import { 
  Activity, 
  AlertTriangle, 
  ArrowRight,
  CheckCircle,
  Play,
  DollarSign,
  TrendingDown,
  TrendingUp
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Command Center — SaaS Vala" }] }),
  component: OneScreenControl,
});

function OneScreenControl() {
  const { critical, high } = getJourneysRequiringAttention();
  const allJourneys = getActiveJourneys();
  
  // Calculate revenue impact
  const totalRevenueImpact = allJourneys.reduce((sum, j) => 
    sum + (j.revenueImpact?.amount || 0), 0
  );
  
  // Get most critical journey
  const mostCritical = critical.length > 0 ? critical[0] : high.length > 0 ? high[0] : null;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto py-8 space-y-6">
        {/* System Identity - Calm, Professional */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{SYSTEM_IDENTITY}</h1>
          <p className="text-lg text-muted-foreground">{SYSTEM_TAGLINE}</p>
        </div>

        {/* Business Health Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Revenue Impact</span>
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div className={`text-2xl font-bold ${totalRevenueImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalRevenueImpact >= 0 ? '+' : ''}{totalRevenueImpact.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This cycle</p>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Critical</span>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-red-600">{critical.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Immediate action</p>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Health</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600">87%</div>
              <p className="text-xs text-muted-foreground mt-1">Operations normal</p>
            </CardContent>
          </Card>
        </div>

        {/* Single Priority Action - What to do NOW */}
        {mostCritical && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Play className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Requires Your Attention</h2>
            </div>
            <Card className="border-l-4 border-l-primary bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{mostCritical.entity.name}</h3>
                      {mostCritical.revenueImpact && (
                        <div className={`flex items-center gap-1 text-sm ${
                          mostCritical.revenueImpact.type === 'positive' ? 'text-green-600' : 
                          mostCritical.revenueImpact.type === 'negative' ? 'text-red-600' : 
                          'text-muted-foreground'
                        }`}>
                          {mostCritical.revenueImpact.type === 'negative' && <TrendingDown className="h-4 w-4" />}
                          {mostCritical.revenueImpact.type === 'positive' && <TrendingUp className="h-4 w-4" />}
                          {mostCritical.revenueImpact.amount > 0 ? '+' : ''}{mostCritical.revenueImpact.amount}
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">
                      {mostCritical.steps[mostCritical.currentStep].description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Step {mostCritical.currentStep + 1} of {mostCritical.steps.length} · {mostCritical.steps[mostCritical.currentStep].estimatedTime}
                    </p>
                  </div>
                  <Button size="lg" className="shrink-0">
                    {mostCritical.steps[mostCritical.currentStep].action}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* All Active Workflows - What's happening */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Active Workflows</h2>
            </div>
            <Link to="/attention" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {allJourneys.slice(0, 4).map((journey) => (
              <JourneyCard key={journey.id} journey={journey} />
            ))}
          </div>
        </section>

        {/* Quick Actions - Only what's needed */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <Link to="/attention">
              <Card className="border-border/60 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span className="font-medium">View Attention</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {critical.length + high.length} items need action
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/master">
              <Card className="border-border/60 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span className="font-medium">Operations</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Master operational view
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Card className="border-border/60 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">System Health</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function JourneyCard({ journey }: { journey: OperationalJourney }) {
  const currentStep = journey.steps[journey.currentStep];
  const progress = ((journey.currentStep) / journey.steps.length) * 100;
  
  return (
    <Card className="border-border/60 hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{journey.entity.name}</h3>
            <p className="text-sm text-muted-foreground">{currentStep?.description}</p>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{currentStep?.title}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <Button size="sm" variant="outline" className="w-full">
          {currentStep?.action}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
