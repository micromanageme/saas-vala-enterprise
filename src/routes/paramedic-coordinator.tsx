import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/paramedic-coordinator")({
  head: () => ({ meta: [{ title: "Paramedic Coordinator — SaaS Vala" }, { name: "description", content: "Paramedic coordination workspace" }] }),
  component: Page,
});

function Page() {
  const { data: paramedicData, isLoading, error } = useQuery({
    queryKey: ["paramedic-coordinator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Paramedic Coordinator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Paramedic Coordinator" subtitle="Paramedic coordination workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Paramedic Coordinator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Responses Today", value: "45", delta: "+5", up: true },
    { label: "Response Time", value: "7min", delta: "-1min", up: true },
    { label: "Patient Survival", value: "96%", delta: "+1%", up: true },
    { label: "Units Active", value: "15", delta: "+2", up: true },
  ];

  const columns = [
    { key: "call", label: "Emergency Call" },
    { key: "type", label: "Type" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { call: "PAR-001", type: "Cardiac", priority: "Critical", status: "In Transit" },
    { call: "PAR-002", type: "Trauma", priority: "High", status: "On Scene" },
    { call: "PAR-003", type: "Medical", priority: "Medium", status: "Completed" },
    { call: "PAR-004", type: "Respiratory", priority: "Critical", status: "Dispatched" },
    { call: "PAR-005", type: "Injury", priority: "Medium", status: "In Transit" },
  ];

  return (
    <AppShell>
      <ModulePage title="Paramedic Coordinator" subtitle="Paramedic coordination workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
