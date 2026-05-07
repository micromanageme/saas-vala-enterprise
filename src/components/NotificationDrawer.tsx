import { Bell, Check, Sparkles, AlertTriangle, Info } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const items = [
  { id: 1, type: "success", title: "Invoice INV-2041 paid", time: "2m ago", priority: "Normal", icon: Check },
  { id: 2, type: "warn", title: "License expiring in 7 days", time: "12m ago", priority: "High", icon: AlertTriangle },
  { id: 3, type: "info", title: "AI: 4 leads need follow-up", time: "1h ago", priority: "AI", icon: Sparkles },
  { id: 4, type: "info", title: "New order SO-1042 confirmed", time: "2h ago", priority: "Normal", icon: Info },
];

export function NotificationDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -right-1 -top-1 h-4 min-w-4 px-1 text-[10px] gradient-primary border-0 animate-pulse">{items.length}</Badge>
        </Button>
      </SheetTrigger>
      <SheetContent className="glass border-l-primary/20">
        <SheetHeader><SheetTitle className="text-gradient">Notifications</SheetTitle></SheetHeader>
        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="priority" className="flex-1">Priority</TabsTrigger>
            <TabsTrigger value="ai" className="flex-1">AI</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-3 space-y-2">
            {items.map((n) => (
              <div key={n.id} className="rounded-xl border border-border/60 bg-card/60 p-3 hover:border-primary/40 hover:shadow-glow transition-all">
                <div className="flex items-start gap-3">
                  <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${n.type === "success" ? "bg-success/20 text-success" : n.type === "warn" ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"}`}>
                    <n.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{n.time}</span><span>·</span><Badge variant="outline" className="h-4 px-1.5 text-[10px]">{n.priority}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="priority" className="mt-3 text-sm text-muted-foreground p-4 text-center">High priority items appear here.</TabsContent>
          <TabsContent value="ai" className="mt-3 text-sm text-muted-foreground p-4 text-center">AI-generated suggestions stream here.</TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
