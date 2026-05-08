import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root")({
  head: () => ({ meta: [{ title: "Universal Access Admin — SaaS Vala" }, { name: "description", content: "Topmost Root Control Panel" }] }),
  component: Page,
});

function Page() {
  const { data: rootData, isLoading, error } = useQuery({
    queryKey: ["root-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/root/dashboard?type=all", {
        headers: {
          'X-Root-Access': 'true',
        },
      });
      if (!response.ok) throw new Error("Failed to fetch Root Admin data");
      return response.json();
    },
    refetchInterval: 10000, // 10-second refresh for root-level monitoring
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Access Admin" subtitle="Topmost Root Control Panel" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Admin data - Root access required</div>
      </AppShell>
    );
  }

  const data = rootData?.data;
  const universalControl = data?.universalControl;

  const kpis = universalControl ? [
    { label: "System Users", value: universalControl.totalSystemUsers.toLocaleString(), delta: "—", up: true },
    { label: "Tenants", value: universalControl.totalTenants.toLocaleString(), delta: "—", up: true },
    { label: "Branches", value: universalControl.totalBranches.toLocaleString(), delta: "—", up: true },
    { label: "Servers", value: universalControl.totalServers.toString(), delta: "—", up: true },
    { label: "Databases", value: universalControl.totalDatabases.toString(), delta: "—", up: true },
    { label: "AI Models", value: universalControl.activeAiModels.toString(), delta: "—", up: true },
    { label: "Workflows", value: universalControl.totalWorkflows.toString(), delta: "—", up: true },
    { label: "System Health", value: universalControl.systemHealth, delta: "—", up: universalControl.systemHealth === 'HEALTHY' },
  ] : [];

  const columns = [
    { key: "name", label: "Component" },
    { key: "route", label: "Route" },
    { key: "status", label: "Status" },
  ];

  const dashboards = data?.systemMap?.dashboards || [];
  const modules = data?.systemMap?.modules || [];
  const apis = data?.systemMap?.apis || [];

  const allComponents = [
    ...dashboards.map((d: any) => ({ ...d, type: 'Dashboard' })),
    ...modules.map((m: any) => ({ ...m, type: 'Module' })),
    ...apis.map((a: any) => ({ ...a, type: 'API' })),
  ];

  const rows = allComponents.map((c: any) => ({
    name: `${c.type}: ${c.name}`,
    route: c.route,
    status: c.status,
  }));

  const emergencyActions = data?.emergencyActions || [];

  return (
    <AppShell>
      <ModulePage 
        title="Universal Access Admin" 
        subtitle="Topmost Root Control Panel" 
        kpis={kpis} 
        columns={columns} 
        rows={rows}
      />
      {universalControl && (
        <div className="mt-4 p-4 border rounded-lg bg-red-50 dark:bg-red-950">
          <h3 className="font-semibold mb-2 text-red-900 dark:text-red-100">Emergency Controls</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Emergency Mode:</span>
              <span className={`ml-2 ${universalControl.emergencyMode ? 'text-red-600' : 'text-green-600'}`}>
                {universalControl.emergencyMode ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Maintenance Mode:</span>
              <span className={`ml-2 ${universalControl.maintenanceMode ? 'text-yellow-600' : 'text-green-600'}`}>
                {universalControl.maintenanceMode ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">System Health:</span>
              <span className={`ml-2 ${universalControl.systemHealth === 'HEALTHY' ? 'text-green-600' : 'text-red-600'}`}>
                {universalControl.systemHealth}
              </span>
            </div>
          </div>
        </div>
      )}
      {emergencyActions.length > 0 && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Emergency Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {emergencyActions.map((action: any) => (
              <button
                key={action.id}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                disabled={action.status !== 'AVAILABLE'}
              >
                {action.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
