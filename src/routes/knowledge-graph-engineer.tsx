import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/knowledge-graph-engineer")({
  head: () => ({ meta: [{ title: "Knowledge Graph Engineer — SaaS Vala" }, { name: "description", content: "Knowledge graph engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: graphData, isLoading, error } = useQuery({
    queryKey: ["knowledge-graph-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Knowledge Graph Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Knowledge Graph Engineer" subtitle="Knowledge graph engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Knowledge Graph Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Nodes", value: "50K", delta: "+5K", up: true },
    { label: "Edges", value: "250K", delta: "+25K", up: true },
    { label: "Relationships", value: "100K", delta: "+10K", up: true },
    { label: "Query Performance", value: "50ms", delta: "-5ms", up: true },
  ];

  const columns = [
    { key: "graph", label: "Knowledge Graph" },
    { key: "domain", label: "Domain" },
    { key: "entities", label: "Entities" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { graph: "KG-001", domain: "Product", entities: "10K", status: "Active" },
    { graph: "KG-002", domain: "Customer", entities: "15K", status: "Active" },
    { graph: "KG-003", domain: "Process", entities: "8K", status: "Active" },
    { graph: "KG-004", domain: "Organization", entities: "12K", status: "In Progress" },
    { graph: "KG-005", domain: "Technology", entities: "5K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Knowledge Graph Engineer" subtitle="Knowledge graph engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
