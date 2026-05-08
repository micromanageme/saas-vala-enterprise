import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/irrigation-supervisor")({
  head: () => ({ meta: [{ title: "Irrigation Supervisor — SaaS Vala" }, { name: "description", content: "Irrigation supervision workspace" }] }),
  component: Page,
});

function Page() {
  const { data: irrigationData, isLoading, error } = useQuery({
    queryKey: ["irrigation-supervisor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Irrigation Supervisor data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Irrigation Supervisor" subtitle="Irrigation supervision workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Irrigation Supervisor data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Water Usage", value: "450K gal", delta: "+50K gal", up: true },
    { label: "System Efficiency", value: "92%", delta: "+2%", up: true },
    { label: "Pumps Active", value: "25", delta: "+2", up: true },
    { label: "Water Savings", value: "15%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "zone", label: "Irrigation Zone" },
    { key: "method", label: "Method" },
    { key: "status", label: "Status" },
    { key: "schedule", label: "Schedule" },
  ];

  const rows = [
    { zone: "ZONE-001", method: "Drip", status: "Active", schedule: "Auto" },
    { zone: "ZONE-002", method: "Sprinkler", status: "Active", schedule: "Auto" },
    { zone: "ZONE-003", method: "Flood", status: "Active", schedule: "Manual" },
    { zone: "ZONE-004", method: "Drip", status: "Standby", schedule: "Auto" },
    { zone: "ZONE-005", method: "Sprinkler", status: "Active", schedule: "Auto" },
  ];

  return (
    <AppShell>
      <ModulePage title="Irrigation Supervisor" subtitle="Irrigation supervision workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
