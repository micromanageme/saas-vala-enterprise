import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/fire-safety-officer")({
  head: () => ({ meta: [{ title: "Fire Safety Officer — SaaS Vala" }, { name: "description", content: "Fire safety workspace" }] }),
  component: Page,
});

function Page() {
  const { data: fireData, isLoading, error } = useQuery({
    queryKey: ["fire-safety-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Fire Safety Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Fire Safety Officer" subtitle="Fire safety workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Fire Safety Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Inspections", value: "125", delta: "+15", up: true },
    { label: "Violations Found", value: "25", delta: "-5", up: true },
    { label: "Compliance Rate", value: "92%", delta: "+3%", up: true },
    { label: "Incidents", value: "3", delta: "-2", up: true },
  ];

  const columns = [
    { key: "inspection", label: "Inspection ID" },
    { key: "property", label: "Property" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { inspection: "INS-001", property: "Building A", type: "Routine", status: "Passed" },
    { inspection: "INS-002", property: "Factory B", type: "Follow-up", status: "Pending" },
    { inspection: "INS-003", property: "School C", type: "Routine", status: "Passed" },
    { inspection: "INS-004", property: "Hospital D", type: "Emergency", status: "Failed" },
    { inspection: "INS-005", property: "Mall E", type: "Routine", status: "Passed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Fire Safety Officer" subtitle="Fire safety workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
