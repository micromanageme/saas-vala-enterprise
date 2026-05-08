import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/cyber-warfare-analyst")({
  head: () => ({ meta: [{ title: "Cyber Warfare Analyst — SaaS Vala" }, { name: "description", content: "Cyber warfare analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: cyberWarfareData, isLoading, error } = useQuery({
    queryKey: ["cyber-warfare-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Cyber Warfare Analyst data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Cyber Warfare Analyst" subtitle="Cyber warfare analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Cyber Warfare Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Operations", value: "3", delta: "+1", up: false },
    { label: "Threats Countered", value: "15", delta: "+5", up: true },
    { label: "Defensive Posture", value: "High", delta: "—", up: true },
    { label: "Intelligence Gathered", value: "234 reports", delta: "+45", up: true },
  ];

  const columns = [
    { key: "operation", label: "Cyber Operation" },
    { key: "type", label: "Type" },
    { key: "threat", label: "Threat Level" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { operation: "OP-SHIELD-001", type: "Defensive", threat: "High", status: "Active" },
    { operation: "OP-MONITOR-002", type: "Intelligence", threat: "Medium", status: "Active" },
    { operation: "OP-RESPOND-003", type: "Countermeasure", threat: "Critical", status: "Active" },
    { operation: "OP-THREAT-004", type: "Hunting", threat: "High", status: "Complete" },
    { operation: "OP-DEFEND-005", type: "Defensive", threat: "Medium", status: "Monitoring" },
  ];

  return (
    <AppShell>
      <ModulePage title="Cyber Warfare Analyst" subtitle="Cyber warfare analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
