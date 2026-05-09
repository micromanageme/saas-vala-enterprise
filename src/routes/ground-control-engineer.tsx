import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/ground-control-engineer")({
  head: () => ({ meta: [{ title: "Ground Control Engineer — SaaS Vala" }, { name: "description", content: "Ground control engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: groundData, isLoading, error } = useQuery({
    queryKey: ["ground-control-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Ground Control Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Ground Control Engineer" subtitle="Ground control engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Ground Control Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Systems Monitored", value: "125", delta: "+10", up: true },
    { label: "Alerts Handled", value: "45", delta: "+5", up: true },
    { label: "System Uptime", value: "99.8%", delta: "+0.1%", up: true },
    { label: "Response Time", value: "15s", delta: "-2s", up: true },
  ];

  const columns = [
    { key: "system", label: "Ground System" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "location", label: "Location" },
  ];

  const rows = [
    { system: "GS-001", type: "Tracking", status: "Online", location: "Station A" },
    { system: "GS-002", type: "Telemetry", status: "Online", location: "Station B" },
    { system: "GS-003", type: "Command", status: "Online", location: "Station C" },
    { system: "GS-004", type: "Data Processing", status: "Maintenance", location: "Station A" },
    { system: "GS-005", type: "Communication", status: "Online", location: "Station D" },
  ];

  return (
    <AppShell>
      <ModulePage title="Ground Control Engineer" subtitle="Ground control engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
