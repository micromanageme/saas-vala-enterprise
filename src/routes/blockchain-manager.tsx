import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/blockchain-manager")({
  head: () => ({ meta: [{ title: "Blockchain Manager — SaaS Vala" }, { name: "description", content: "Blockchain management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: blockchainData, isLoading, error } = useQuery({
    queryKey: ["blockchain-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Blockchain Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Blockchain Manager" subtitle="Blockchain management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Blockchain Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Nodes Active", value: "45", delta: "+5", up: true },
    { label: "Transactions Processed", value: "125K", delta: "+15K", up: true },
    { label: "Block Height", value: "2.5M", delta: "+50K", up: true },
    { label: "Network Hash Rate", value: "450 TH/s", delta: "+25 TH/s", up: true },
  ];

  const columns = [
    { key: "node", label: "Blockchain Node" },
    { key: "type", label: "Type" },
    { key: "sync", label: "Sync Status" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { node: "NODE-001", type: "Validator", sync: "Synced", status: "Active" },
    { node: "NODE-002", type: "Full Node", sync: "Synced", status: "Active" },
    { node: "NODE-003", type: "Validator", sync: "Syncing", status: "Active" },
    { node: "NODE-004", type: "Light Node", sync: "Synced", status: "Standby" },
    { node: "NODE-005", type: "Validator", sync: "Synced", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Blockchain Manager" subtitle="Blockchain management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
