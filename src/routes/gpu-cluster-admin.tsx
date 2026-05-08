import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/gpu-cluster-admin")({
  head: () => ({ meta: [{ title: "GPU Cluster Admin — SaaS Vala" }, { name: "description", content: "GPU cluster administration" }] }),
  component: Page,
});

function Page() {
  const { data: gpuData, isLoading, error } = useQuery({
    queryKey: ["gpu-cluster-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch GPU Cluster Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="GPU Cluster Admin" subtitle="GPU cluster administration" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load GPU Cluster Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "GPUs Available", value: "128", delta: "+16", up: true },
    { label: "GPU Utilization", value: "85%", delta: "+3%", up: true },
    { label: "Training Jobs", value: "12", delta: "+2", up: true },
    { label: "Memory Usage", value: "78%", delta: "+5%", up: false },
  ];

  const columns = [
    { key: "cluster", label: "GPU Cluster" },
    { key: "gpus", label: "GPUs" },
    { key: "model", label: "GPU Model" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { cluster: "Training Cluster A", gpus: "64", model: "A100 80GB", status: "Active" },
    { cluster: "Training Cluster B", gpus: "32", model: "V100 32GB", status: "Active" },
    { cluster: "Inference Cluster", gpus: "16", model: "T4 16GB", status: "Active" },
    { cluster: "Dev Cluster", gpus: "8", model: "A10G 24GB", status: "Active" },
    { cluster: "Backup Cluster", gpus: "8", model: "V100 32GB", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="GPU Cluster Admin" subtitle="GPU cluster administration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
