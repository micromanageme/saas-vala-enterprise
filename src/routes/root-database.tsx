import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-database")({
  head: () => ({ meta: [{ title: "Database Control — Universal Access Admin" }, { name: "description", content: "Root-level database management" }] }),
  component: Page,
});

function Page() {
  const { data: dbData, isLoading, error } = useQuery({
    queryKey: ["root-database"],
    queryFn: async () => {
      const response = await fetch("/api/root/database?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch database data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Database Control" subtitle="Root-level database management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Database Control data</div>
      </AppShell>
    );
  }

  const data = dbData?.data;
  const databases = data?.databases || [];

  const kpis = [
    { label: "Total Databases", value: databases.length.toString(), delta: "—", up: true },
    { label: "Active", value: databases.filter((d: any) => d.status === 'ACTIVE').length.toString(), delta: "—", up: true },
    { label: "Tables", value: data?.tables?.length.toString() || "0", delta: "—", up: true },
    { label: "Backups", value: data?.backups?.length.toString() || "0", delta: "—", up: true },
  ];

  const columns = [
    { key: "name", label: "Database" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "size", label: "Size" },
    { key: "connections", label: "Connections" },
    { key: "region", label: "Region" },
  ];

  const rows = databases.map((d: any) => ({
    name: d.name,
    type: d.type,
    status: d.status,
    size: d.size,
    connections: d.connections.toString(),
    region: d.region,
  }));

  return (
    <AppShell>
      <ModulePage title="Database Control" subtitle="Root-level database management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
