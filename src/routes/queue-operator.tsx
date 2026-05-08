import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/queue-operator")({
  head: () => ({ meta: [{ title: "Queue Operator — SaaS Vala" }, { name: "description", content: "Queue operations workspace" }] }),
  component: Page,
});

function Page() {
  const { data: queueData, isLoading, error } = useQuery({
    queryKey: ["queue-operator-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Queue Operator data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Queue Operator" subtitle="Queue operations workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Queue Operator data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Queues", value: "23", delta: "+3", up: true },
    { label: "Messages Queued", value: "45.2K", delta: "+5K", up: false },
    { label: "Processing Rate", value: "2.5K/s", delta: "+0.5K/s", up: true },
    { label: "Dead Letters", value: "125", delta: "-25", up: true },
  ];

  const columns = [
    { key: "queue", label: "Queue" },
    { key: "depth", label: "Depth" },
    { key: "consumers", label: "Consumers" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { queue: "email-queue", depth: "5.2K", consumers: "8", status: "Active" },
    { queue: "payment-queue", depth: "2.3K", consumers: "12", status: "Active" },
    { queue: "notification-queue", depth: "8.5K", consumers: "5", status: "Backlog" },
    { queue: "analytics-queue", depth: "15K", consumers: "10", status: "Active" },
    { queue: "report-queue", depth: "1.2K", consumers: "3", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Queue Operator" subtitle="Queue operations workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
