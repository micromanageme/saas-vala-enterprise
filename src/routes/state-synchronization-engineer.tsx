import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/state-synchronization-engineer")({
  head: () => ({ meta: [{ title: "State Synchronization Engineer — SaaS Vala" }, { name: "description", content: "State synchronization engineering workspace" }] }),
  component: Page,
});

function Page() {
  const { data: stateData, isLoading, error } = useQuery({
    queryKey: ["state-synchronization-engineer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch State Synchronization Engineer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="State Synchronization Engineer" subtitle="State synchronization engineering workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load State Synchronization Engineer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Sync Operations", value: "2.5K", delta: "+250", up: true },
    { label: "Sync Success", value: "99%", delta: "+0.5%", up: true },
    { label: "Latency", value: "100ms", delta: "-20ms", up: true },
    { label: "Conflicts", value: "5", delta: "-2", up: true },
  ];

  const columns = [
    { key: "sync", label: "Sync Job" },
    { key: "source", label: "Source" },
    { key: "destination", label: "Destination" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { sync: "SYNC-001", source: "DB-A", destination: "DB-B", status: "Active" },
    { sync: "SYNC-002", source: "Cache", destination: "DB-C", status: "Active" },
    { sync: "SYNC-003", source: "DB-B", destination: "Cache", status: "Active" },
    { sync: "SYNC-004", source: "API", destination: "DB-A", status: "Pending" },
    { sync: "SYNC-005", source: "DB-C", destination: "DB-B", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="State Synchronization Engineer" subtitle="State synchronization engineering workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
