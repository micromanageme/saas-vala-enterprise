import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/reality-mirror-controller")({
  head: () => ({ meta: [{ title: "Reality Mirror Controller — SaaS Vala" }, { name: "description", content: "Reality mirror control workspace" }] }),
  component: Page,
});

function Page() {
  const { data: realityData, isLoading, error } = useQuery({
    queryKey: ["reality-mirror-controller-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Reality Mirror Controller data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Reality Mirror Controller" subtitle="Reality mirror control workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Reality Mirror Controller data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Mirrors Active", value: "25", delta: "+3", up: true },
    { label: "Sync Rate", value: "99.9%", delta: "+0.1%", up: true },
    { label: "Fidelity", value: "98%", delta: "+1%", up: true },
    { label: "Latency", value: "10ms", delta: "-2ms", up: true },
  ];

  const columns = [
    { key: "mirror", label: "Reality Mirror" },
    { key: "type", label: "Type" },
    { key: "instances", label: "Instances" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { mirror: "RMR-001", type: "Production", instances: "10", status: "Active" },
    { mirror: "RMR-002", type: "Staging", instances: "5", status: "Active" },
    { mirror: "RMR-003", type: "Development", instances: "8", status: "Active" },
    { mirror: "RMR-004", type: "Production", instances: "12", status: "Active" },
    { mirror: "RMR-005", type: "Testing", instances: "3", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="Reality Mirror Controller" subtitle="Reality mirror control workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
