import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/intelligence-analyst")({
  head: () => ({ meta: [{ title: "Intelligence Analyst — SaaS Vala" }, { name: "description", content: "Intelligence analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: intelData, isLoading, error } = useQuery({
    queryKey: ["intelligence-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Intelligence Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Intelligence Analyst" subtitle="Intelligence analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Intelligence Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Reports", value: "25", delta: "+4", up: true },
    { label: "Threats Identified", value: "8", delta: "+1", up: false },
    { label: "Intel Accuracy", value: "96%", delta: "+2%", up: true },
    { label: "Data Sources", value: "45", delta: "+3", up: true },
  ];

  const columns = [
    { key: "report", label: "Intelligence Report" },
    { key: "classification", label: "Classification" },
    { key: "source", label: "Source" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { report: "INT-2024-001", classification: "Secret", source: "HUMINT", status: "Active" },
    { report: "INT-2024-002", classification: "Confidential", source: "SIGINT", status: "Review" },
    { report: "INT-2024-003", classification: "Top Secret", source: "OSINT", status: "Active" },
    { report: "INT-2024-004", classification: "Secret", source: "MASINT", status: "Pending" },
    { report: "INT-2024-005", classification: "Confidential", source: "HUMINT", status: "Completed" },
  ];

  return (
    <AppShell>
      <ModulePage title="Intelligence Analyst" subtitle="Intelligence analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
