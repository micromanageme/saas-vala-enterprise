import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/network-operations-center")({
  head: () => ({ meta: [{ title: "Network Operations Center — SaaS Vala" }, { name: "description", content: "Network operations center workspace" }] }),
  component: Page,
});

function Page() {
  const { data: nocData, isLoading, error } = useQuery({
    queryKey: ["network-operations-center-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Network Operations Center data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Network Operations Center" subtitle="Network operations center workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Network Operations Center data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Nodes Monitored", value: "2.5K", delta: "+250", up: true },
    { label: "Incidents", value: "8", delta: "-2", up: true },
    { label: "MTTR", value: "15min", delta: "-5min", up: true },
    { label: "Availability", value: "99.95%", delta: "+0.05%", up: true },
  ];

  const columns = [
    { key: "network", label: "Network Segment" },
    { key: "health", label: "Health" },
    { key: "traffic", label: "Traffic" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { network: "Core Network", health: "99.9%", traffic: "80%", status: "Healthy" },
    { network: "Edge Network", health: "99.5%", traffic: "60%", status: "Healthy" },
    { network: "Metro Network", health: "99.8%", traffic: "70%", status: "Healthy" },
    { network: "Access Network", health: "99.2%", traffic: "50%", status: "Degraded" },
    { network: "Backbone", health: "100%", traffic: "90%", status: "Healthy" },
  ];

  return (
    <AppShell>
      <ModulePage title="Network Operations Center" subtitle="Network operations center workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
