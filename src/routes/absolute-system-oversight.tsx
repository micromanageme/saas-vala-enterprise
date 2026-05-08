import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/absolute-system-oversight")({
  head: () => ({ meta: [{ title: "Absolute System Oversight — SaaS Vala" }, { name: "description", content: "Absolute system oversight workspace" }] }),
  component: Page,
});

function Page() {
  const { data: oversightData, isLoading, error } = useQuery({
    queryKey: ["absolute-system-oversight-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Absolute System Oversight data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Absolute System Oversight" subtitle="Absolute system oversight workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Absolute System Oversight data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Systems Monitored", value: "500", delta: "+50", up: true },
    { label: "Oversight Coverage", value: "100%", delta: "0%", up: true },
    { label: "Critical Alerts", value: "0", delta: "0", up: true },
    { label: "System Health", value: "99.9%", delta: "+0.1%", up: true },
  ];

  const columns = [
    { key: "system", label: "System Component" },
    { key: "level", label: "Oversight Level" },
    { key: "health", label: "Health" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { system: "SYS-001", level: "Critical", health: "100%", status: "Monitored" },
    { system: "SYS-002", level: "High", health: "99%", status: "Monitored" },
    { system: "SYS-003", level: "Critical", health: "100%", status: "Monitored" },
    { system: "SYS-004", level: "High", health: "98%", status: "Monitored" },
    { system: "SYS-005", level: "Critical", health: "100%", status: "Monitored" },
  ];

  return (
    <AppShell>
      <ModulePage title="Absolute System Oversight" subtitle="Absolute system oversight workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
