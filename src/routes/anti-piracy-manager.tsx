import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/anti-piracy-manager")({
  head: () => ({ meta: [{ title: "Anti-Piracy Manager — SaaS Vala" }, { name: "description", content: "Anti-piracy management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: piracyData, isLoading, error } = useQuery({
    queryKey: ["anti-piracy-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Anti-Piracy Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Anti-Piracy Manager" subtitle="Anti-piracy management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Anti-Piracy Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Piracy Links Removed", value: "5K", delta: "+500", up: true },
    { label: "Sites Monitored", value: "500", delta: "+50", up: true },
    { label: "Content Protected", value: "95%", delta: "+2%", up: true },
    { label: "Revenue Saved", value: "$1.2M", delta: "+$150K", up: true },
  ];

  const columns = [
    { key: "source", label: "Piracy Source" },
    { key: "content", label: "Content Type" },
    { key: "violations", label: "Violations" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { source: "SRC-001", content: "Video", violations: "500", status: "Blocked" },
    { source: "SRC-002", content: "Software", violations: "300", status: "Blocked" },
    { source: "SRC-003", content: "Music", violations: "400", status: "Blocked" },
    { source: "SRC-004", content: "Document", violations: "200", status: "In Progress" },
    { source: "SRC-005", content: "Video", violations: "350", status: "Blocked" },
  ];

  return (
    <AppShell>
      <ModulePage title="Anti-Piracy Manager" subtitle="Anti-piracy management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
