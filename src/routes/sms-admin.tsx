import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/sms-admin")({
  head: () => ({ meta: [{ title: "SMS Admin — SaaS Vala" }, { name: "description", content: "SMS administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: smsData, isLoading, error } = useQuery({
    queryKey: ["sms-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch SMS Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="SMS Admin" subtitle="SMS administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load SMS Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "SMS Sent Today", value: "25K", delta: "+2K", up: true },
    { label: "Delivery Rate", value: "97%", delta: "+1%", up: true },
    { label: "Opt-out Rate", value: "0.5%", delta: "-0.1%", up: true },
    { label: "Response Rate", value: "15%", delta: "+1%", up: true },
  ];

  const columns = [
    { key: "campaign", label: "SMS Campaign" },
    { key: "recipients", label: "Recipients" },
    { key: "delivered", label: "Delivered" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { campaign: "SMS-001", recipients: "5K", delivered: "4.85K", status: "Sent" },
    { campaign: "SMS-002", recipients: "8K", delivered: "7.76K", status: "Sent" },
    { campaign: "SMS-003", recipients: "3K", delivered: "2.91K", status: "Scheduled" },
    { campaign: "SMS-004", recipients: "6K", delivered: "5.82K", status: "Sent" },
    { campaign: "SMS-005", recipients: "3K", delivered: "2.91K", status: "Draft" },
  ];

  return (
    <AppShell>
      <ModulePage title="SMS Admin" subtitle="SMS administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
