import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/configuration-governance-admin")({
  head: () => ({ meta: [{ title: "Configuration Governance Admin — SaaS Vala" }, { name: "description", content: "Configuration governance administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: configData, isLoading, error } = useQuery({
    queryKey: ["configuration-governance-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Configuration Governance Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Configuration Governance Admin" subtitle="Configuration governance administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Configuration Governance Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Configurations Managed", value: "250", delta: "+25", up: true },
    { label: "Compliance Rate", value: "95%", delta: "+2%", up: true },
    { label: "Drift Detected", value: "3", delta: "-2", up: true },
    { label: "Audit Score", value: "4.7/5", delta: "+0.1", up: true },
  ];

  const columns = [
    { key: "config", label: "Configuration" },
    { key: "environment", label: "Environment" },
    { key: "version", label: "Version" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { config: "CFG-001", environment: "Production", version: "v2.0", status: "Compliant" },
    { config: "CFG-002", environment: "Staging", version: "v2.1", status: "Drift Detected" },
    { config: "CFG-003", environment: "Development", version: "v2.2", status: "Compliant" },
    { config: "CFG-004", environment: "Production", version: "v1.9", status: "Compliant" },
    { config: "CFG-005", environment: "Testing", version: "v2.0", status: "Compliant" },
  ];

  return (
    <AppShell>
      <ModulePage title="Configuration Governance Admin" subtitle="Configuration governance administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
