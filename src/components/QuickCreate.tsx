import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ui, UI_EVENTS } from "@/lib/ui-bus";
import { FilePlus, UserPlus, ShoppingCart, FileText, Users, Calendar, Sparkles } from "lucide-react";
import { toast } from "sonner";

const actions = [
  { label: "New Lead", icon: UserPlus, to: "/crm" },
  { label: "New Sales Order", icon: ShoppingCart, to: "/erp" },
  { label: "New Invoice", icon: FileText, to: "/invoices" },
  { label: "New Employee", icon: Users, to: "/hrm" },
  { label: "New Project", icon: FilePlus, to: "/projects" },
  { label: "New Event", icon: Calendar, to: "/calendar" },
];

export function QuickCreate() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  useEffect(() => ui.on(UI_EVENTS.openQuickCreate, () => setOpen(true)), []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="glass max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Quick Create
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((a) => (
            <Button
              key={a.label}
              variant="outline"
              className="justify-start h-12 hover:border-primary/40 hover:shadow-glow"
              onClick={() => {
                setOpen(false);
                nav({ to: a.to });
                toast.success(`${a.label} ready`, { description: "Form opened in module." });
              }}
            >
              <a.icon className="h-4 w-4 mr-2 text-primary" />
              {a.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
