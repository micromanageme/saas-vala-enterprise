import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/message-bus-admin")({
  head: () => ({ meta: [{ title: "Message Bus Admin — SaaS Vala" }, { name: "description", content: "Message bus administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: messageBusData, isLoading, error } = useQuery({
    queryKey: ["message-bus-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Message Bus Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Message Bus Admin" subtitle="Message bus administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Message Bus Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Messages/Second", value: "50K", delta: "+5K", up: true },
    { label: "Topics Active", value: "45", delta: "+5", up: true },
    { label: "Latency", value: "5ms", delta: "-1ms", up: true },
    { label: "Throughput", value: "100MB/s", delta: "+10MB/s", up: true },
  ];

  const columns = [
    { key: "topic", label: "Topic" },
    { key: "partitions", label: "Partitions" },
    { key: "throughput", label: "Throughput" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { topic: "TOPIC-001", partitions: "8", throughput: "10MB/s", status: "Active" },
    { topic: "TOPIC-002", partitions: "4", throughput: "5MB/s", status: "Active" },
    { topic: "TOPIC-003", partitions: "16", throughput: "20MB/s", status: "Active" },
    { topic: "TOPIC-004", partitions: "2", throughput: "2MB/s", status: "Standby" },
    { topic: "TOPIC-005", partitions: "8", throughput: "8MB/s", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Message Bus Admin" subtitle="Message bus administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
