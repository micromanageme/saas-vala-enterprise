import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LayoutTemplate, Sparkles } from "lucide-react";
import { TEMPLATES, type WorkspaceTemplate } from "./widget-types";

export function WorkspaceTemplates({ onApply }: { onApply: (t: WorkspaceTemplate) => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <LayoutTemplate className="h-4 w-4" /> Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>Workspace templates</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <Card key={t.id} className="group flex cursor-pointer flex-col p-4 transition-all hover:border-primary/60 hover:shadow-md" onClick={() => onApply(t)}>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <div className="font-semibold">{t.name}</div>
              </div>
              <div className="flex-1 text-xs text-muted-foreground">{t.description}</div>
              <div className="mt-3 flex flex-wrap gap-1">
                {t.widgets.slice(0, 4).map((w) => (
                  <span key={w.id} className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {w.type}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
