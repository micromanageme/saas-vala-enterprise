import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/inference-server-admin")({
  head: () => ({ meta: [{ title: "Inference Server Admin — SaaS Vala" }, { name: "description", content: "Inference server administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: inferenceData, isLoading, error } = useQuery({
    queryKey: ["inference-server-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Inference Server Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Inference Server Admin" subtitle="Inference server administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Inference Server Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Inferences/Second", value: "10K", delta: "+1K", up: true },
    { label: "Latency", value: "25ms", delta: "-5ms", up: true },
    { label: "Server Uptime", value: "99.9%", delta: "+0.1%", up: true },
    { label: "GPU Utilization", value: "75%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "server", label: "Inference Server" },
    { key: "model", label: "Model" },
    { key: "throughput", label: "Throughput" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { server: "INF-001", model: "BERT", throughput: "5K", status: "Active" },
    { server: "INF-002", model: "ResNet", throughput: "3K", status: "Active" },
    { server: "INF-003", model: "GPT", throughput: "2K", status: "Active" },
    { server: "INF-004", model: "YOLO", throughput: "4K", status: "Maintenance" },
    { server: "INF-005", model: "Transformer", throughput: "6K", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Inference Server Admin" subtitle="Inference server administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
