import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/mechanical-engineer")({
  head: () => ({ meta: [{ title: "Mechanical Engineer — SaaS Vala" }, { name: "description", content: "Mechanical engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: mechanicalData, isLoading, error } = useQuery({
    queryKey: ["mechanical-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Mechanical Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Mechanical Engineer" subtitle="Mechanical engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Mechanical Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Systems Designed", value: "85", delta: "+10", up: true },
    { label: "Efficiency Rating", value: "92%", delta: "+3%", up: true },
    { label: "Reliability", value: "98%", delta: "+1%", up: true },
    { label: "Prototypes", value: "15", delta: "+2", up: true },
  ];

  const columns = [
    { key: "system", label: "Mechanical System" },
    { key: "type", label: "Type" },
    { key: "capacity", label: "Capacity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { system: "MECH-001", type: "HVAC", capacity: "500 tons", status: "Active" },
    { system: "MECH-002", type: "Pumping", capacity: "1000 GPM", status: "Active" },
    { system: "MECH-003", type: "Conveyor", capacity: "500 TPH", status: "Maintenance" },
    { system: "MECH-004", type: "Lifting", capacity: "50 tons", status: "Active" },
    { system: "MECH-005", type: "Compressed Air", capacity: "500 CFM", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Mechanical Engineer" subtitle="Mechanical engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
