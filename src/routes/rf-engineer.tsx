import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/rf-engineer")({
  head: () => ({ meta: [{ title: "RF Engineer — SaaS Vala" }, { name: "description", content: "RF engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: rfData, isLoading, error } = useQuery({
    queryKey: ["rf-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch RF Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="RF Engineer" subtitle="RF engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load RF Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Sites Optimized", value: "25", delta: "+3", up: true },
    { label: "Signal Strength", value: "-65 dBm", delta: "+3 dBm", up: true },
    { label: "Interference", value: "0.2%", delta: "-0.1%", up: true },
    { label: "Throughput", value: "95%", delta: "+2%", up: true },
  ];

  const columns = [
    { key: "site", label: "RF Site" },
    { key: "frequency", label: "Frequency Band" },
    { key: "power", label: "Power (dBm)" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { site: "RF-001", frequency: "2.4 GHz", power: "-60", status: "Optimized" },
    { site: "RF-002", frequency: "5 GHz", power: "-55", status: "Optimized" },
    { site: "RF-003", frequency: "700 MHz", power: "-70", status: "Optimized" },
    { site: "RF-004", frequency: "3.5 GHz", power: "-65", status: "In Progress" },
    { site: "RF-005", frequency: "28 GHz", power: "-50", status: "Optimized" },
  ];

  return (
    <AppShell>
      <ModulePage title="RF Engineer" subtitle="RF engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
