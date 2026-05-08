import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/edge-security-analyst")({
  head: () => ({ meta: [{ title: "Edge Security Analyst — SaaS Vala" }, { name: "description", content: "Edge security analysis workspace" }] }),
  component: Page,
});

function Page() {
  const { data: edgeSecurityData, isLoading, error } = useQuery({
    queryKey: ["edge-security-analyst-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Edge Security Analyst data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Edge Security Analyst" subtitle="Edge security analysis workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Edge Security Analyst data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Edge Nodes Secured", value: "50", delta: "+5", up: true },
    { label: "Threats Blocked", value: "150", delta: "+15", up: true },
    { label: "Security Score", value: "95", delta: "+2", up: true },
    { label: "Compliance", value: "98%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "node", label: "Edge Node" },
    { key: "threats", label: "Threats Blocked" },
    { key: "score", label: "Security Score" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { node: "EDGE-001", threats: "25", score: "95", status: "Secure" },
    { node: "EDGE-002", threats: "30", score: "92", status: "Secure" },
    { node: "EDGE-003", threats: "20", score: "98", status: "Secure" },
    { node: "EDGE-004", threats: "35", score: "88", status: "Warning" },
    { node: "EDGE-005", threats: "25", score: "96", status: "Secure" },
  ];

  return (
    <AppShell>
      <ModulePage title="Edge Security Analyst" subtitle="Edge security analysis workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
