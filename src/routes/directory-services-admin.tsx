import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/directory-services-admin")({
  head: () => ({ meta: [{ title: "Directory Services Admin — SaaS Vala" }, { name: "description", content: "Directory services administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: directoryData, isLoading, error } = useQuery({
    queryKey: ["directory-services-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Directory Services Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Directory Services Admin" subtitle="Directory services administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Directory Services Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Users Managed", value: "25K", delta: "+2K", up: true },
    { label: "Groups", value: "500", delta: "+50", up: true },
    { key: "sync", label: "Sync Status", value: "100%", delta: "0%", up: true },
    { label: "Replication Lag", value: "5sec", delta: "-1sec", up: true },
  ];

  const columns = [
    { key: "directory", label: "Directory" },
    { key: "type", label: "Type" },
    { key: "entries", label: "Entries" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { directory: "DIR-001", type: "Primary", entries: "15K", status: "Active" },
    { directory: "DIR-002", type: "Replica", entries: "15K", status: "Active" },
    { directory: "DIR-003", type: "Standalone", entries: "5K", status: "Active" },
    { directory: "DIR-004", type: "Primary", entries: "10K", status: "Maintenance" },
    { directory: "DIR-005", type: "Replica", entries: "10K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Directory Services Admin" subtitle="Directory services administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
