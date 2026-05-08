import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/enterprise-search-engineer")({
  head: () => ({ meta: [{ title: "Enterprise Search Engineer — SaaS Vala" }, { name: "description", content: "Enterprise search engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: enterpriseData, isLoading, error } = useQuery({
    queryKey: ["enterprise-search-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Enterprise Search Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Enterprise Search Engineer" subtitle="Enterprise search engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Enterprise Search Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Sources Indexed", value: "25", delta: "+3", up: true },
    { label: "Search Queries", value: "50K", delta: "+5K", up: true },
    { label: "Zero Results", value: "2%", delta: "-0.5%", up: true },
    { label: "Click-Through", value: "65%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "source", label: "Data Source" },
    { key: "type", label: "Type" },
    { key: "records", label: "Records" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { source: "SRC-001", type: "Database", records: "100K", status: "Active" },
    { source: "SRC-002", type: "File System", records: "50K", status: "Active" },
    { source: "SRC-003", type: "Email", records: "200K", status: "Active" },
    { source: "SRC-004", type: "Cloud", records: "75K", status: "In Progress" },
    { source: "SRC-005", type: "API", records: "30K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Enterprise Search Engineer" subtitle="Enterprise search engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
