import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/surveillance-analyst")({
  head: () => ({ meta: [{ title: "Surveillance Analyst — SaaS Vala" }, { name: "description", content: "Surveillance analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: surveillanceData, isLoading, error } = useQuery({
    queryKey: ["surveillance-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Surveillance Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Surveillance Analyst" subtitle="Surveillance analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Surveillance Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Monitors", value: "125", delta: "+15", up: true },
    { label: "Alerts Generated", value: "45", delta: "+8", up: true },
    { label: "False Positives", value: "12%", delta: "-3%", up: true },
    { label: "Coverage Area", value: "85%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "target", label: "Surveillance Target" },
    { key: "type", label: "Type" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { target: "TARGET-001", type: "Video", duration: "30 days", status: "Active" },
    { target: "TARGET-002", type: "Audio", duration: "15 days", status: "Active" },
    { target: "TARGET-003", type: "Digital", duration: "45 days", status: "In Progress" },
    { target: "TARGET-004", type: "Physical", duration: "7 days", status: "Pending" },
    { target: "TARGET-005", type: "Combined", duration: "60 days", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Surveillance Analyst" subtitle="Surveillance analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
