import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  getJourneysRequiringAttention,
  type OperationalJourney
} from "@/lib/operational-journey";
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  DollarSign,
  TrendingDown
} from "lucide-react";

export const Route = createFileRoute("/attention")({ component: AttentionCenter });

function AttentionCenter() {
  const { critical, high, normal } = getJourneysRequiringAttention();

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">What Requires Attention</h1>
          <p className="text-muted-foreground mt-1">Business events needing your action</p>
        </div>

        {/* Critical Issues */}
        {critical.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold">Critical</h2>
              <span className="text-sm text-red-500">{critical.length} items</span>
            </div>
            <div className="space-y-3">
              {critical.map((journey) => (
                <JourneyCard key={journey.id} journey={journey} />
              ))}
            </div>
          </section>
        )}

        {/* High Priority */}
        {high.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-semibold">High Priority</h2>
              <span className="text-sm text-orange-500">{high.length} items</span>
            </div>
            <div className="space-y-3">
              {high.map((journey) => (
                <JourneyCard key={journey.id} journey={journey} />
              ))}
            </div>
          </section>
        )}

        {/* Normal Priority */}
        {normal.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Normal</h2>
              <span className="text-sm text-blue-500">{normal.length} items</span>
            </div>
            <div className="space-y-3">
              {normal.map((journey) => (
                <JourneyCard key={journey.id} journey={journey} />
              ))}
            </div>
          </section>
        )}

        {/* No items */}
        {critical.length === 0 && high.length === 0 && normal.length === 0 && (
          <Card className="border-border/60">
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Clear</h3>
              <p className="text-muted-foreground">No items require your attention right now</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

function JourneyCard({ journey }: { journey: OperationalJourney }) {
  const currentStep = journey.steps[journey.currentStep];
  const progress = ((journey.currentStep) / journey.steps.length) * 100;
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <Card className="border-border/60 hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{journey.entity.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(currentStep?.priority || 'normal')} bg-opacity-10`}>
                {currentStep?.priority}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{currentStep?.description}</p>
          </div>
          
          {journey.revenueImpact && (
            <div className={`flex items-center gap-1 text-sm ${
              journey.revenueImpact.type === 'positive' ? 'text-green-600' : 
              journey.revenueImpact.type === 'negative' ? 'text-red-600' : 
              'text-muted-foreground'
            }`}>
              {journey.revenueImpact.type === 'negative' && <TrendingDown className="h-4 w-4" />}
              {journey.revenueImpact.type === 'positive' && <DollarSign className="h-4 w-4" />}
              {journey.revenueImpact.amount > 0 ? '+' : ''}{journey.revenueImpact.amount}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Action */}
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">Next: </span>
            <span className="font-medium">{currentStep?.title}</span>
          </div>
          <Button size="sm">
            {currentStep?.action}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
