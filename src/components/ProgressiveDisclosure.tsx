import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProgressiveDisclosureProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
  label?: string;
  expandLabel?: string;
  collapseLabel?: string;
}

export function ProgressiveDisclosure({ 
  children, 
  defaultExpanded = false,
  label,
  expandLabel = "Show more",
  collapseLabel = "Show less"
}: ProgressiveDisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="space-y-2">
      {isExpanded ? (
        <div className="space-y-2">
          {children}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="w-full"
          >
            <ChevronUp className="h-4 w-4 mr-2" />
            {collapseLabel}
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="w-full"
        >
          <ChevronDown className="h-4 w-4 mr-2" />
          {label || expandLabel}
        </Button>
      )}
    </div>
  );
}

interface SimpleViewProps {
  title: string;
  value: string;
  status?: 'normal' | 'warning' | 'error' | 'success';
  trend?: 'up' | 'down' | 'stable';
}

export function SimpleView({ title, value, status = 'normal', trend }: SimpleViewProps) {
  const statusColors = {
    normal: 'text-foreground',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    success: 'text-green-600',
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{title}</span>
      <div className="flex items-center gap-2">
        <span className={`font-medium ${statusColors[status]}`}>{value}</span>
        {trend && (
          <span className="text-xs text-muted-foreground">
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
    </div>
  );
}

interface AdvancedViewProps {
  children: React.ReactNode;
  title: string;
}

export function AdvancedView({ children, title }: AdvancedViewProps) {
  return (
    <div className="mt-4 pt-4 border-t">
      <h4 className="text-sm font-semibold mb-3">{title}</h4>
      {children}
    </div>
  );
}
