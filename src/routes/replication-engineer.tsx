import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/replication-engineer")({
  head: () => ({ meta: [{ title: "Replication Engineer — SaaS Vala" }, { name: "description", content: "Replication engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: replicationData, isLoading, error } = useQuery({
    queryKey: ["replication-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Replication Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Replication Engineer" subtitle="Replication engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Replication Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Replication Jobs", value: "50", delta: "+5", up: true },
    { label: "Data Synced", value: "10TB", delta: "+1TB", up: true },
    { label: "Sync Success", value: "99%", delta: "+0.5%", up: true },
    { label: "Lag", value: "1sec", delta: "-0.2sec", up: true },
  ];

  const columns = [
    { key: "job", label: "Replication Job" },
    { key: "source", label: "Source" },
    { key: "target", label: "Target" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { job: "REP-001", source: "DB-Primary", target: "DB-Replica", status: "Active" },
    { job: "REP-002", source: "Cache-A", target: "Cache-B", status: "Active" },
    { job: "REP-003", source: "Storage-X", target: "Storage-Y", status: "Active" },
    { job: "REP-004", source: "DB-Primary", target: "DB-Backup", status: "In Progress" },
    { job: "REP-005", source: "Cache-C", target: "Cache-D", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Replication Engineer" subtitle="Replication engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
