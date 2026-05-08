import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/prison-admin")({
  head: () => ({ meta: [{ title: "Prison Admin — SaaS Vala" }, { name: "description", content: "Prison administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: prisonData, isLoading, error } = useQuery({
    queryKey: ["prison-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Prison Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Prison Admin" subtitle="Prison administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Prison Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Inmates", value: "850", delta: "+25", up: true },
    { label: "Capacity", value: "92%", delta: "+2%", up: false },
    { label: "Staff", value: "150", delta: "+10", up: true },
    { label: "Incidents", value: "3", delta: "-2", up: true },
  ];

  const columns = [
    { key: "block", label: "Prison Block" },
    { key: "inmates", label: "Inmates" },
    { key: "capacity", label: "Capacity" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { block: "BLOCK-A", inmates: "200", capacity: "200", status: "Full" },
    { block: "BLOCK-B", inmates: "180", capacity: "200", status: "Available" },
    { block: "BLOCK-C", inmates: "195", capacity: "200", status: "Available" },
    { block: "BLOCK-D", inmates: "150", capacity: "200", status: "Available" },
    { block: "BLOCK-E", inmates: "125", capacity: "200", status: "Available" },
  ];

  return (
    <AppShell>
      <ModulePage title="Prison Admin" subtitle="Prison administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
