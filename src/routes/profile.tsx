import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw, UserCheck, AlertTriangle } from "lucide-react";
import { hasHierarchyAccess, canImpersonateUser, getWorkflowIsolationRules } from "@/lib/rbac/role-isolation";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — SaaS Vala" }, { name: "description", content: "Your profile, preferences & security" }] }),
  component: Page,
});

function Page() {
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          return response.json();
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
      return null;
    },
  });

  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/roles");
        if (response.ok) {
          return response.json();
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
      return null;
    },
  });

  const user = userData?.user;
  const roles = rolesData?.roles || [];
  const currentRole = user?.roles?.[0]?.name?.toLowerCase().replace(/\s+/g, '_') || '';
  const isSuperAdmin = user?.roles?.some((r: any) => r.name === "Super Admin");
  
  // Get role isolation rules
  const workflowRules = getWorkflowIsolationRules(currentRole);
  const canImpersonate = isSuperAdmin || workflowRules.canImpersonate.length > 0;
  
  const kpis = [
    { label: "Name", value: user?.displayName || "User", delta: "—", up: true },
    { label: "Email", value: user?.email || "—", delta: "—", up: true },
    { label: "Primary Role", value: user?.roles?.[0]?.name || "—", delta: "—", up: true },
    { label: "Status", value: user?.status || "Active", delta: "—", up: true }
  ];
  
  const columns = [{ key: "key", label: "Setting" }, { key: "value", label: "Value" }, { key: "scope", label: "Scope" }, { key: "updated", label: "Updated" }];
  const rows = [
    {
      "key": "Display name",
      "value": user?.displayName || "User",
      "scope": "Personal",
      "updated": "today"
    },
    {
      "key": "Timezone",
      "value": "UTC+5:30",
      "scope": "Personal",
      "updated": "1w"
    }
  ];

  const handleRoleSwitch = async (targetRoleSlug: string) => {
    if (!user?.id) return;
    
    // Validate role switch using isolation engine
    const targetRole = roles.find((r: any) => r.name.toLowerCase().replace(/\s+/g, '_') === targetRoleSlug);
    if (!targetRole) {
      alert("Target role not found");
      return;
    }
    
    // Check if current role can impersonate target role
    if (!isSuperAdmin && !canImpersonateUser(currentRole, targetRoleSlug)) {
      alert("Insufficient permissions to switch to this role");
      return;
    }
    
    // Check hierarchy access
    if (!isSuperAdmin && !hasHierarchyAccess(currentRole, targetRoleSlug)) {
      alert("Cannot switch to higher hierarchy role");
      return;
    }
    
    try {
      const response = await fetch("/api/admin/role-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: user.id,
          targetRoleId: targetRole.id,
          currentRole: currentRole,
          targetRole: targetRoleSlug,
        }),
      });
      if (response.ok) {
        alert(`Switched to ${targetRole.name} successfully. Refresh to see changes.`);
        window.location.reload();
      } else {
        alert("Failed to switch roles");
      }
    } catch (error) {
      console.error("Failed to switch roles:", error);
      alert("Failed to switch roles");
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Profile" subtitle="Your profile, preferences & security" kpis={kpis} columns={columns} rows={[]} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ModulePage 
        title="Profile" 
        subtitle="Your profile, preferences & security" 
        kpis={kpis} 
        columns={columns} 
        rows={rows}
        extra={
          canImpersonate && (
            <div className="mt-4 space-y-4">
              <div className="p-4 rounded-lg border border-border/60 bg-card/60">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Role Switching</div>
                    <div className="text-xs text-muted-foreground">Switch roles using isolation engine validation</div>
                  </div>
                </div>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {roles.map((role: any) => {
                    const roleSlug = role.name.toLowerCase().replace(/\s+/g, '_');
                    const canSwitch = isSuperAdmin || 
                      (canImpersonateUser(currentRole, roleSlug) || hasHierarchyAccess(currentRole, roleSlug));
                    return (
                      <div key={role.id} className="flex items-center justify-between p-2 rounded bg-background/50">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{role.name}</span>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleRoleSwitch(roleSlug)}
                          variant={currentRole === roleSlug ? "secondary" : "outline"}
                          disabled={!canSwitch || currentRole === roleSlug}
                        >
                          {currentRole === roleSlug ? "Current" : "Switch"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {workflowRules.canEscalate.length > 0 && (
                <div className="p-3 rounded-lg border border-border/60 bg-card/60">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <div className="text-xs text-muted-foreground">
                      Can escalate to: {workflowRules.canEscalate.join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }
      />
    </AppShell>
  );
}
