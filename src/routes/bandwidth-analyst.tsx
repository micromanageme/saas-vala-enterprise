import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/bandwidth-analyst")({
  head: () => ({ meta: [{ title: "Bandwidth Analyst — SaaS Vala" }, { name: "description", content: "Bandwidth analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: bandwidthData, isLoading, error } = useQuery({
    queryKey: ["bandwidth-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Bandwidth Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Bandwidth Analyst" subtitle="Bandwidth analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Bandwidth Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Total Bandwidth", value: "500 Gbps", delta: "+50 Gbps", up: true },
    { label: "Utilization", value: "75%", delta: "+5%", up: true },
    { label: "Peak Usage", value: "450 Gbps", delta: "+40 Gbps", up: true },
    { label: "Efficiency", value: "92%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "network", label: "Network Segment" },
    { key: "allocated", label: "Allocated" },
    { key: "used", label: "Used" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { network: "Core Backbone", allocated: "200 Gbps", used: "150 Gbps", status: "Normal" },
    { network: "Metro Access", allocated: "150 Gbps", used: "120 Gbps", status: "Normal" },
    { network: "Edge Network", allocated: "100 Gbps", used: "95 Gbps, status: "High Usage" },
    { network: "Data Center", allocated: "50 Gbps", used: "40 Gbps", status: "Normal" },
    { network: "Backup Link", allocated: "20 Gbps", used: "5 Gbps", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="Bandwidth Analyst" subtitle="Bandwidth analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
