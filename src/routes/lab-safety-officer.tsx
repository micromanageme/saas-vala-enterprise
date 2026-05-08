import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/lab-safety-officer")({
  head: () => ({ meta: [{ title: "Lab Safety Officer — SaaS Vala" }, { name: "description", content: "Lab safety workspace" }] }),
  component: Page,
});

function Page() {
  const { data: safetyData, isLoading, error } = useQuery({
    queryKey: ["lab-safety-officer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Lab Safety Officer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Lab Safety Officer" subtitle="Lab safety workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Lab Safety Officer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Inspections", value: "125", delta: "+15", up: true },
    { label: "Incidents", value: "2", delta: "-1", up: true },
    { label: "Compliance Rate", value: "97%", delta: "+2%", up: true },
    { label: "Training Completed", value: "95%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "inspection", label: "Safety Inspection" },
    { key: "lab", label: "Laboratory" },
    { key: "violations", label: "Violations" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { inspection: "INS-001", lab: "LAB-001", violations: "0", status: "Passed" },
    { inspection: "INS-002", lab: "LAB-002", violations: "2", status: "Follow-up" },
    { inspection: "INS-003", lab: "LAB-003", violations: "0", status: "Passed" },
    { inspection: "INS-004", lab: "LAB-004", violations: "1", status: "Corrected" },
    { inspection: "INS-005", lab: "LAB-005", violations: "0", status: "Passed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Lab Safety Officer" subtitle="Lab safety workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
