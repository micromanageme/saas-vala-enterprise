import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-lineage")({
  head: () => ({ meta: [{ title: "Universal Data Lineage — Universal Access Admin" }, { name: "description", content: "Source tracing, transformation map, ownership graph" }] }),
  component: Page,
});

function Page() {
  const { data: lineageData, isLoading, error } = useQuery({
    queryKey: ["root-lineage"],
    queryFn: async () => {
      const response = await fetch("/api/root/data-lineage?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch data lineage data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Universal Data Lineage" subtitle="Source tracing, transformation map, ownership graph" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Universal Data Lineage data</div>
      </AppShell>
    );
  }

  const data = lineageData?.data;
  const sources = data?.dataSources || [];
  const ownership = data?.ownershipGraph;

  const kpis = ownership ? [
    { label: "Total Entities", value: ownership.totalEntities.toString(), delta: "—", up: true },
    { label: "Mapped", value: ownership.mappedEntities.toString(), delta: "—", up: true },
    { label: "Unmapped", value: ownership.unmappedEntities.toString(), delta: "—", up: ownership.unmappedEntities === 0 },
    { label: "Data Sources", value: sources.length.toString(), delta: "—", up: true },
  ];

  const columns = [
    { key: "name", label: "Source" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "tables", label: "Tables" },
  ];

  const rows = sources.map((s: any) => ({
    name: s.name,
    type: s.type,
    status: s.status,
    tables: s.tables.toString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Universal Data Lineage" subtitle="Source tracing, transformation map, ownership graph" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
