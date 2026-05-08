import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/email-admin")({
  head: () => ({ meta: [{ title: "Email Admin — SaaS Vala" }, { name: "description", content: "Email administration workspace" }] }),
  component: Page,
});

function Page() {
  const { data: emailData, isLoading, error } = useQuery({
    queryKey: ["email-admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Email Admin data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Email Admin" subtitle="Email administration workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Email Admin data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Emails Sent Today", value: "50K", delta: "+5K", up: true },
    { label: "Delivery Rate", value: "98%", delta: "+0.5%", up: true },
    { label: "Open Rate", value: "45%", delta: "+2%", up: true },
    { label: "Spam Complaints", value: "0.1%", delta: "-0.05%", up: true },
  ];

  const columns = [
    { key: "campaign", label: "Email Campaign" },
    { key: "recipients", label: "Recipients" },
    { key: "delivered", label: "Delivered" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { campaign: "EMC-001", recipients: "10K", delivered: "9.8K", status: "Sent" },
    { campaign: "EMC-002", recipients: "15K", delivered: "14.7K", status: "Sent" },
    { campaign: "EMC-003", recipients: "8K", delivered: "7.9K", status: "Scheduled" },
    { campaign: "EMC-004", recipients: "12K", delivered: "11.8K", status: "Sent" },
    { campaign: "EMC-005", recipients: "5K", delivered: "4.9K", status: "Draft" },
  ];

  return (
    <AppShell>
      <ModulePage title="Email Admin" subtitle="Email administration workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
