import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/push-notification-manager")({
  head: () => ({ meta: [{ title: "Push Notification Manager — SaaS Vala" }, { name: "description", content: "Push notification management workspace" }] }),
  component: Page,
});

function Page() {
  const { data: pushData, isLoading, error } = useQuery({
    queryKey: ["push-notification-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Push Notification Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Push Notification Manager" subtitle="Push notification management workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Push Notification Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Pushes Sent Today", value: "100K", delta: "+10K", up: true },
    { label: "Delivery Rate", value: "96%", delta: "+1%", up: true },
    { label: "Open Rate", value: "35%", delta: "+2%", up: true },
    { label: "Unsubscribe Rate", value: "0.3%", delta: "-0.1%", up: true },
  ];

  const columns = [
    { key: "campaign", label: "Push Campaign" },
    { key: "platform", label: "Platform" },
    { key: "delivered", label: "Delivered" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { campaign: "PUSH-001", platform: "iOS", delivered: "30K", status: "Sent" },
    { campaign: "PUSH-002", platform: "Android", delivered: "35K", status: "Sent" },
    { campaign: "PUSH-003", platform: "Web", delivered: "20K", status: "Scheduled" },
    { campaign: "PUSH-004", platform: "iOS", delivered: "25K", status: "Sent" },
    { campaign: "PUSH-005", platform: "Android", delivered: "15K", status: "Draft" },
  ];

  return (
    <AppShell>
      <ModulePage title="Push Notification Manager" subtitle="Push notification management workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
