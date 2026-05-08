import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/semantic-search-admin")({
  head: () => ({ meta: [{ title: "Semantic Search Admin — SaaS Vala" }, { name: "description", content: "Semantic search administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: searchData, isLoading, error } = useQuery({
    queryKey: ["semantic-search-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Semantic Search Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Semantic Search Admin" subtitle="Semantic search administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Semantic Search Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Indexed Documents", value: "50K", delta: "+5K", up: true },
    { label: "Queries Today", value: "10K", delta: "+1K", up: true },
    { label: "Relevance Score", value: "92%", delta: "+2%", up: true },
    { label: "Response Time", value: "100ms", delta: "-10ms", up: true },
  ];

  const columns = [
    { key: "index", label: "Search Index" },
    { key: "type", label: "Type" },
    { key: "documents", label: "Documents" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { index: "IDX-001", type: "Content", documents: "20K", status: "Active" },
    { index: "IDX-002", type: "Product", documents: "15K", status: "Active" },
    { index: "IDX-003", type: "User", documents: "10K", status: "Active" },
    { index: "IDX-004", type: "Document", documents: "5K", status: "In Progress" },
    { index: "IDX-005", type: "Media", documents: "8K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Semantic Search Admin" subtitle="Semantic search administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
