import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/defense-command-admin")({
  head: () => ({ meta: [{ title: "Defense Command Admin — SaaS Vala" }, { name: "description", content: "Defense command administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: defenseData, isLoading, error } = useQuery({
    queryKey: ["defense-command-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Defense Command Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Defense Command Admin" subtitle="Defense command administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Defense Command Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Operations", value: "12", delta: "+2", up: true },
    { label: "Personnel Deployed", value: "2.5K", delta: "+150", up: true },
    { label: "Readiness Level", value: "95%", delta: "+2%", up: true },
    { label: "Security Status", value: "Elevated", delta: "—", up: true },
  ];

  const columns = [
    { key: "operation", label: "Operation" },
    { key: "theater", label: "Theater" },
    { key: "status", label: "Status" },
    { key: "priority", label: "Priority" },
  ];

  const rows = [
    { operation: "OP-SECURE-01", theater: "Northern", status: "Active", priority: "Critical" },
    { operation: "OP-PATROL-02", theater: "Eastern", status: "Active", priority: "High" },
    { operation: "OP-TRAINING-03", theater: "Central", status: "In Progress", priority: "Medium" },
    { operation: "OP-RESCUE-04", theater: "Southern", status: "Standby", priority: "High" },
    { operation: "OP-SUPPORT-05", theater: "Western", status: "Active", priority: "Medium" },
  ];

  return (
    <AppShell>
      <ModulePage title="Defense Command Admin" subtitle="Defense command administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
