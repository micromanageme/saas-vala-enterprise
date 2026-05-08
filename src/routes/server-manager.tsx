import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/server-manager")({
  head: () => ({ meta: [{ title: "Server Manager — SaaS Vala" }, { name: "description", content: "Server infrastructure management" }] }),
  component: Page,
});

function Page() {
  const { data: serverData, isLoading, error } = useQuery({
    queryKey: ["server-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Server Manager data");
      return response.json();
    },
    refetchInterval: 15000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Server Manager" subtitle="Server infrastructure management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Server Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Total Servers", value: "28", delta: "+2", up: true },
    { label: "Server Health", value: "98%", delta: "+1%", up: true },
    { label: "Avg CPU", value: "45%", delta: "-3%", up: true },
    { label: "Avg Memory", value: "62%", delta: "-2%", up: true },
  ];

  const columns = [
    { key: "server", label: "Server" },
    { key: "status", label: "Status" },
    { key: "cpu", label: "CPU" },
    { key: "memory", label: "Memory" },
  ];

  const rows = [
    { server: "app-server-01", status: "Healthy", cpu: "42%", memory: "58%" },
    { server: "app-server-02", status: "Healthy", cpu: "38%", memory: "55%" },
    { server: "db-server-01", status: "Healthy", cpu: "65%", memory: "78%" },
    { server: "cache-server-01", status: "Healthy", cpu: "25%", memory: "45%" },
    { server: "worker-server-01", status: "Healthy", cpu: "52%", memory: "68%" },
  ];

  return (
    <AppShell>
      <ModulePage title="Server Manager" subtitle="Server infrastructure management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
