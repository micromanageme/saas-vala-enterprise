import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-settings")({
  head: () => ({ meta: [{ title: "Universal Settings — Universal Access Admin" }, { name: "description", content: "Root-level global configuration management" }] }),
  component: Page,
});

function Page() {
  const { data: settingsData, isLoading, error } = useQuery({
    queryKey: ["root-settings"],
    queryFn: async () => {
      const response = await fetch("/api/root/settings?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch settings data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Settings" subtitle="Root-level global configuration management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Settings data</div>
      </AppShell>
    );
  }

  const data = settingsData?.data;
  const secrets = data?.secrets || [];
  const integrations = data?.integrations || [];
  const globalConfig = data?.globalConfig;

  const kpis = [
    { label: "Secrets", value: secrets.length.toString(), delta: "—", up: true },
    { label: "Integrations", value: integrations.length.toString(), delta: "—", up: true },
    { label: "Maintenance Mode", value: globalConfig?.maintenanceMode ? "ON" : "OFF", delta: "—", up: !globalConfig?.maintenanceMode },
    { label: "Emergency Mode", value: globalConfig?.emergencyMode ? "ON" : "OFF", delta: "—", up: !globalConfig?.emergencyMode },
  ];

  const columns = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "lastRotated", label: "Last Rotated" },
  ];

  const rows = secrets.map((s: any) => ({
    name: s.name,
    type: s.type,
    status: s.status,
    lastRotated: new Date(s.lastRotated).toLocaleDateString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Settings" subtitle="Root-level global configuration management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
