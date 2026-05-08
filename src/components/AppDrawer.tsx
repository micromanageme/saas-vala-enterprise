import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { X, Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getAccessibleApps } from "@/lib/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

interface AppDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppDrawer({ open, onOpenChange }: AppDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { roles } = useAuth();
  const accessibleApps = getAccessibleApps(roles);

  const filteredApps = accessibleApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAppClick = (appId: string) => {
    onOpenChange(false);
    navigate({ to: `/apps/${appId}` });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Apps</h2>
            <p className="text-sm text-muted-foreground">Choose an application to work with</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className="flex items-start gap-4 p-6 border rounded-lg hover:bg-accent transition-colors text-left group"
            >
              <div
                className="p-3 rounded-lg shrink-0"
                style={{ backgroundColor: `${app.color}20` }}
              >
                <app.icon className="h-6 w-6" style={{ color: app.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold group-hover:text-primary transition-colors">{app.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{app.description}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
