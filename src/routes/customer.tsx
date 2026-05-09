import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/customer")({
  head: () => ({ meta: [{ title: "Customer Dashboard — SaaS Vala" }, { name: "description", content: "Customer portal" }] }),
  component: Page,
});

function Page() {
  const { data: custData, isLoading, error } = useQuery({
    queryKey: ["customer-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Customer data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Customer Dashboard" subtitle="Customer portal" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Customer data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Active Subscriptions", value: "2", delta: "—", up: true },
    { label: "Open Tickets", value: "1", delta: "—", up: true },
    { label: "Monthly Spend", value: "$450", delta: "—", up: true },
    { label: "Usage", value: "78%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "subscription", label: "Subscription" },
    { key: "plan", label: "Plan" },
    { key: "status", label: "Status" },
    { key: "renewal", label: "Renewal" },
  ];

  const rows = [
    { subscription: "Enterprise License", plan: "Enterprise", status: "Active", renewal: "2025-03-15" },
    { subscription: "Support Package", plan: "Premium", status: "Active", renewal: "2025-06-15" },
  ];

  return (
    <AppShell>
      <ModulePage title="Customer Dashboard" subtitle="Customer portal" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
