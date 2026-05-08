import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/root-messagebus")({
  head: () => ({ meta: [{ title: "Root Message Bus Control — Universal Access Admin" }, { name: "description", content: "Kafka/RabbitMQ/NATS, queue health, dead-letter queues" }] }),
  component: Page,
});

function Page() {
  const { data: busData, isLoading, error } = useQuery({
    queryKey: ["root-messagebus"],
    queryFn: async () => {
      const response = await fetch("/api/root/message-bus?type=all", {
        headers: { 'X-Root-Access': 'true' },
      });
      if (!response.ok) throw new Error("Failed to fetch message bus data");
      return response.json();
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Root Message Bus Control" subtitle="Kafka/RabbitMQ/NATS, queue health, dead-letter queues" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Root Message Bus Control data</div>
      </AppShell>
    );
  }

  const data = busData?.data;
  const queues = data?.queues || [];
  const retry = data?.retryOrchestration;

  const kpis = retry ? [
    { label: "Total Retries", value: retry.totalRetries.toString(), delta: "—", up: true },
    { label: "Successful", value: retry.successfulRetries.toString(), delta: "—", up: true },
    { label: "Failed", value: retry.failedRetries.toString(), delta: "—", up: retry.failedRetries === 0 },
    { label: "Max Retries", value: retry.maxRetries.toString(), delta: "—", up: true },
  ] : [];

  const columns = [
    { key: "name", label: "Queue" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "messages", label: "Messages" },
    { key: "consumers", label: "Consumers" },
  ];

  const rows = queues.map((q: any) => ({
    name: q.name,
    type: q.type,
    status: q.status,
    messages: q.messages.toLocaleString(),
    consumers: q.consumers.toString(),
  }));

  return (
    <AppShell>
      <ModulePage title="Root Message Bus Control" subtitle="Kafka/RabbitMQ/NATS, queue health, dead-letter queues" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
