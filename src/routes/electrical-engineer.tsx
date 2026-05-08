import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/electrical-engineer")({
  head: () => ({ meta: [{ title: "Electrical Engineer — SaaS Vala" }, { name: "description", content: "Electrical engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: electricalData, isLoading, error } = useQuery({
    queryKey: ["electrical-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Electrical Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Electrical Engineer" subtitle="Electrical engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Electrical Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Circuits Designed", value: "150", delta: "+20", up: true },
    { label: "Power Efficiency", value: "94%", delta: "+2%", up: true },
    { label: "Safety Rating", value: "100%", delta: "—", up: true },
    { label: "Installations", value: "45", delta: "+5", up: true },
  ];

  const columns = [
    { key: "project", label: "Electrical Project" },
    { key: "type", label: "Type" },
    { key: "voltage", label: "Voltage" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { project: "ELEC-001", type: "Distribution", voltage: "11kV", status: "Active" },
    { project: "ELEC-002", type: "Lighting", voltage: "220V", status: "Completed" },
    { project: "ELEC-003", type: "Power", voltage: "33kV", status: "In Progress" },
    { project: "ELEC-004", type: "Control", voltage: "24V", status: "Active" },
    { project: "ELEC-005", type: "Distribution", voltage: "415V", status: "Planning" },
  ];

  return (
    <AppShell>
      <ModulePage title="Electrical Engineer" subtitle="Electrical engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
