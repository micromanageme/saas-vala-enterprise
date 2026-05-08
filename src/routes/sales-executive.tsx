import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/sales-executive")({
  head: () => ({ meta: [{ title: "Sales Executive — SaaS Vala" }, { name: "description", content: "Sales executive workspace" }] }),
  component: Page,
});

function Page() {
  const { data: salesExecData, isLoading, error } = useQuery({
    queryKey: ["sales-executive-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Sales Executive data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Sales Executive" subtitle="Sales executive workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Sales Executive data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Deals Closed", value: "8", delta: "+2", up: true },
    { label: "Revenue", value: "$45K", delta: "+12%", up: true },
    { label: "Calls Made", value: "45", delta: "+8", up: true },
    { label: "Quota", value: "82%", delta: "+5%", up: true },
  ];

  const columns = [
    { key: "lead", label: "Lead" },
    { key: "company", label: "Company" },
    { key: "stage", label: "Stage" },
    { key: "value", label: "Value" },
  ];

  const rows = [
    { lead: "James Wilson", company: "TechCorp", stage: "Proposal", value: "$12K" },
    { lead: "Lisa Anderson", company: "Innovate Ltd", stage: "Negotiation", value: "$8K" },
    { lead: "Robert Taylor", company: "Global Systems", stage: "Qualified", value: "$15K" },
    { lead: "Jennifer Lee", company: "Future Tech", stage: "Discovery", value: "$6K" },
    { lead: "Michael Brown", company: "Smart Solutions", stage: "Closed", value: "$10K" },
  ];

  return (
    <AppShell>
      <ModulePage title="Sales Executive" subtitle="Sales executive workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
