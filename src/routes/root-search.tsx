import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-search")({
  head: () => ({ meta: [{ title: "Universal Search Engine — Universal Access Admin" }, { name: "description", content: "Global search index, cross-module search, permission-aware search" }] }),
  component: Page,
});

function Page() {
  const { data: searchData, isLoading, error } = useQuery({
    queryKey: ["root-search"],
    queryFn: async () => {
      const response = await fetch("/api/root/search?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch search data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Search Engine" subtitle="Global search index, cross-module search, permission-aware search" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Search Engine data</div>
      </AppShell>
    );
  }

  const data = searchData?.data;
  const modules = data?.searchModules || [];
  const index = data?.searchIndex;

  const kpis = index ? [
    { label: "Total Documents", value: index.totalDocuments.toLocaleString(), delta: "—", up: true },
    { label: "Indexed", value: index.indexedDocuments.toLocaleString(), delta: "—", up: true },
    { label: "Pending", value: index.pendingIndex.toString(), delta: "—", up: index.pendingIndex === 0 },
    { label: "Index Size", value: index.indexSize, delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "name", label: "Module" },
    { key: "documents", label: "Documents" },
    { key: "status", label: "Status" },
  ];

  const rows = modules.map((m: any) => ({
    name: m.name,
    documents: m.documents.toLocaleString(),
    status: m.status,
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Search Engine" subtitle="Global search index, cross-module search, permission-aware search" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
