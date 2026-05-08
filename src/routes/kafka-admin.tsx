import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/kafka-admin")({
  head: () => ({ meta: [{ title: "Kafka Admin — SaaS Vala" }, { name: "description", content: "Kafka administration" }] }),
  component: Page,
});

function Page() {
  const { data: kafkaData, isLoading, error } = useQuery({
    queryKey: ["kafka-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Kafka Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Kafka Admin" subtitle="Kafka administration" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Kafka Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Brokers", value: "9", delta: "+1", up: true },
    { label: "Topics", value: "45", delta: "+5", up: true },
    { key: "partitions", label: "Partitions", value: "234", delta: "+23", up: true },
    { label: "Consumer Lag", value: "5K", delta: "-2K", up: true },
  ];

  const columns = [
    { key: "cluster", label: "Cluster" },
    { key: "brokers", label: "Brokers" },
    { key: "health", label: "Health" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { cluster: "Production", brokers: "9", health: "Healthy", status: "Active" },
    { cluster: "Staging", brokers: "3", health: "Healthy", status: "Active" },
    { cluster: "Development", brokers: "2", health: "Healthy", status: "Active" },
    { cluster: "Analytics", brokers: "4", health: "Healthy", status: "Active" },
    { cluster: "DR", brokers: "3", health: "Healthy", status: "Standby" },
  ];

  return (
    <AppShell>
      <ModulePage title="Kafka Admin" subtitle="Kafka administration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
