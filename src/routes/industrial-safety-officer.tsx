import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/industrial-safety-officer")({
  head: () => ({ meta: [{ title: "Industrial Safety Officer — SaaS Vala" }, { name: "description", content: "Industrial safety workspace" }] }),
  component: Page,
});

function Page() {
  const { data: safetyData, isLoading, error } = useQuery({
    queryKey: ["industrial-safety-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Industrial Safety Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Industrial Safety Officer" subtitle="Industrial safety workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Industrial Safety Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Incidents This Month", value: "3", delta: "-2", up: true },
    { label: "Safety Training Completed", value: "95%", delta: "+5%", up: true },
    { label: "Compliance Score", value: "98%", delta: "+1%", up: true },
    { label: "Days Without Incident", value: "125", delta: "+15", up: true },
  ];

  const columns = [
    { key: "incident", label: "Safety Incident" },
    { key: "severity", label: "Severity" },
    { key: "resolved", label: "Resolved" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { incident: "INC-2024-001", severity: "Low", resolved: "Yes", status: "Closed" },
    { incident: "INC-2024-002", severity: "Medium", resolved: "Yes", status: "Closed" },
    { incident: "INC-2024-003", severity: "Low", resolved: "Yes", status: "Closed" },
    { incident: "INC-2024-004", severity: "High", resolved: "No", status: "In Progress" },
    { incident: "INC-2024-005", severity: "Low", resolved: "Yes", status: "Closed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Industrial Safety Officer" subtitle="Industrial safety workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
