import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/hpc-admin")({
  head: () => ({ meta: [{ title: "HPC Admin — SaaS Vala" }, { name: "description", content: "High Performance Computing administration" }] }),
  component: Page,
});

function Page() {
  const { data: hpcData, isLoading, error } = useQuery({
    queryKey: ["hpc-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch HPC Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="HPC Admin" subtitle="High Performance Computing administration" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load HPC Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Compute Nodes", value: "256", delta: "+32", up: true },
    { label: "Utilization", value: "78%", delta: "+5%", up: true },
    { label: "Jobs Queued", value: "45", delta: "-8", up: true },
    { label: "Avg Job Time", value: "4.5h", delta: "-0.5h", up: true },
  ];

  const columns = [
    { key: "cluster", label: "HPC Cluster" },
    { key: "nodes", label: "Nodes" },
    { key: "cores", label: "Cores" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { cluster: "Primary Compute", nodes: "128", cores: "4096", status: "Active" },
    { cluster: "ML Training", nodes: "64", cores: "2048", status: "Active" },
    { cluster: "Simulation", nodes: "32", cores: "1024", status: "Active" },
    { cluster: "Rendering", nodes: "16", cores: "512", status: "Active" },
    { cluster: "Backup", nodes: "16", cores: "512", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="HPC Admin" subtitle="High Performance Computing administration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
