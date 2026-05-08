import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/universal-sentinel-commander")({
  head: () => ({ meta: [{ title: "Universal Sentinel Commander — SaaS Vala" }, { name: "description", content: "Universal sentinel command workspace" }] }),
  component: Page,
});

function Page() {
  const { data: sentinelData, isLoading, error } = useQuery({
    queryKey: ["universal-sentinel-commander-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Universal Sentinel Commander data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Sentinel Commander" subtitle="Universal sentinel command workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Sentinel Commander data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Sentinels Active", value: "25", delta: "+3", up: true },
    { label: "Threats Neutralized", value: "150", delta: "+20", up: true },
    { label: "Coverage", value: "99%", delta: "+1%", up: true },
    { label: "Response Time", value: "5sec", delta: "-1sec", up: true },
  ];

  const columns = [
    { key: "sentinel", label: "Sentinel" },
    { key: "domain", label: "Domain" },
    { key: "level", label: "Protection Level" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { sentinel: "SNT-001", domain: "Infrastructure", level: "Critical", status: "Active" },
    { sentinel: "SNT-002", domain: "Application", level: "High", status: "Active" },
    { sentinel: "SNT-003", domain: "Data", level: "Critical", status: "Active" },
    { sentinel: "SNT-004", domain: "Network", level: "High", status: "Standby" },
    { sentinel: "SNT-005", domain: "Identity", level: "Critical", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Universal Sentinel Commander" subtitle="Universal sentinel command workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
