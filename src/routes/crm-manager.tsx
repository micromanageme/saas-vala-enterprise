import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/crm-manager")({
  head: () => ({ meta: [{ title: "CRM Manager — SaaS Vala" }, { name: "description", content: "CRM operations management" }] }),
  component: Page,
});

function Page() {
  const { data: crmData, isLoading, error } = useQuery({
    queryKey: ["crm-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch CRM Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="CRM Manager" subtitle="CRM operations management" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load CRM Manager data</div>
      </AppShell>
    );
  }

  const data = crmData?.analytics;
  const kpis = data ? [
    { label: "Total Leads", value: data.marketplace?.totalVendors?.toLocaleString() || "0", delta: "+12%", up: true },
    { label: "Conversion Rate", value: "4.5%", delta: "+0.8%", up: true },
    { label: "Active Deals", value: "156", delta: "+23", up: true },
    { label: "Customer Satisfaction", value: "4.3/5", delta: "+0.2", up: true },
  ];

  const columns = [
    { key: "lead", label: "Lead" },
    { key: "company", label: "Company" },
    { key: "stage", label: "Stage" },
    { key: "value", label: "Value" },
  ];

  const rows = [
    { lead: "James Wilson", company: "TechCorp", stage: "Proposal", value: "$25K" },
    { lead: "Lisa Anderson", company: "Innovate Ltd", stage: "Negotiation", value: "$45K" },
    { lead: "Robert Taylor", company: "Global Systems", stage: "Qualified", value: "$18K" },
    { lead: "Jennifer Lee", company: "Future Tech", stage: "Discovery", value: "$12K" },
    { lead: "Michael Brown", company: "Smart Solutions", stage: "Proposal", value: "$32K" },
  ];

  return (
    <AppShell>
      <ModulePage title="CRM Manager" subtitle="CRM operations management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
