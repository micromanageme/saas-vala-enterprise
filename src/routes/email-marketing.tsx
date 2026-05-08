import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/email-marketing")({
  head: () => ({ meta: [{ title: "Email Marketing — SaaS Vala" }, { name: "description", content: "Email marketing management" }] }),
  component: Page,
});

function Page() {
  const { data: emailData, isLoading, error } = useQuery({
    queryKey: ["email-marketing-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Email Marketing data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Email Marketing" subtitle="Email marketing management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Email Marketing data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Subscribers", value: "12.5K", delta: "+18%", up: true },
    { label: "Open Rate", value: "28.5%", delta: "+2.3%", up: true },
    { label: "Click Rate", value: "4.2%", delta: "+0.8%", up: true },
    { label: "Unsubscribes", value: "0.8%", delta: "-0.2%", up: true },
  ];

  const columns = [
    { key: "campaign", label: "Campaign" },
    { key: "sent", label: "Sent" },
    { key: "openRate", label: "Open Rate" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { campaign: "Weekly Newsletter", sent: "12,500", openRate: "32%", status: "Sent" },
    { campaign: "Product Update", sent: "8,200", openRate: "28%", status: "Sent" },
    { campaign: "Promotional Offer", sent: "10,000", openRate: "25%", status: "Scheduled" },
    { campaign: "Welcome Series", sent: "1,234", openRate: "45%", status: "Active" },
    { campaign: "Re-engagement", sent: "2,500", openRate: "18%", status: "Sent" },
  ];

  return (
    <AppShell>
      <ModulePage title="Email Marketing" subtitle="Email marketing management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
