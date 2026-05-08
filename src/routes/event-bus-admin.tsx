import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/event-bus-admin")({
  head: () => ({ meta: [{ title: "Event Bus Admin — SaaS Vala" }, { name: "description", content: "Event bus administration" }] }),
  component: Page,
});

function Page() {
  const { data: eventBusData, isLoading, error } = useQuery({
    queryKey: ["event-bus-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Event Bus Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Event Bus Admin" subtitle="Event bus administration" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Event Bus Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Events/Day", value: "5.2M", delta: "+0.8M", up: true },
    { label: "Topics", value: "45", delta: "+5", up: true },
    { label: "Throughput", value: "120K/s", delta: "+15K/s", up: true },
    { label: "Latency", value: "15ms", delta: "-3ms", up: true },
  ];

  const columns = [
    { key: "topic", label: "Topic" },
    { key: "partitions", label: "Partitions" },
    { key: "throughput", label: "Throughput" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { topic: "user-events", partitions: "12", throughput: "45K/s", status: "Active" },
    { topic: "order-events", partitions: "8", throughput: "35K/s", status: "Active" },
    { topic: "payment-events", partitions: "6", throughput: "20K/s", status: "Active" },
    { topic: "notification-events", partitions: "4", throughput: "12K/s", status: "Active" },
    { topic: "audit-events", partitions: "3", throughput: "8K/s", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Event Bus Admin" subtitle="Event bus administration" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
