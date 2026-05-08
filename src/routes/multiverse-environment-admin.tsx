import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/multiverse-environment-admin")({
  head: () => ({ meta: [{ title: "Multiverse Environment Admin — SaaS Vala" }, { name: "description", content: "Multiverse environment administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: multiverseData, isLoading, error } = useQuery({
    queryKey: ["multiverse-environment-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Multiverse Environment Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Multiverse Environment Admin" subtitle="Multiverse environment administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Multiverse Environment Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Environments", value: "8", delta: "+1", up: true },
    { label: "Isolation", value: "100%", delta: "0%", up: true },
    { label: "Sync Success", value: "98%", delta: "+1%", up: true },
    { label: "Resource Efficiency", value: "85%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "environment", label: "Environment" },
    { key: "type", label: "Type" },
    { key: "instances", label: "Instances" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { environment: "ENV-001", type: "Production", instances: "50", status: "Active" },
    { environment: "ENV-002", type: "Staging", instances: "25", status: "Active" },
    { environment: "ENV-003", type: "Development", instances: "30", status: "Active" },
    { environment: "ENV-004", type: "Testing", instances: "15", status: "Standby" },
    { environment: "ENV-005", type: "Sandbox", instances: "10", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Multiverse Environment Admin" subtitle="Multiverse environment administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
