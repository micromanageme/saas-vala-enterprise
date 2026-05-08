import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/business-development-manager")({
  head: () => ({ meta: [{ title: "Business Development Manager — SaaS Vala" }, { name: "description", content: "Business development workspace" }] }),
  component: Page,
});

function Page() {
  const { data: bdData, isLoading, error } = useQuery({
    queryKey: ["business-development-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Business Development Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Business Development Manager" subtitle="Business development workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Business Development Manager data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Partnerships", value: "23", delta: "+4", up: true },
    { label: "Pipeline Value", value: "$5.2M", delta: "+$0.8M", up: true },
    { label: "Conversion Rate", value: "35%", delta: "+5%", up: true },
    { label: "New Markets", value: "3", delta: "+1", up: true },
  ];

  const columns = [
    { key: "opportunity", label: "Business Opportunity" },
    { key: "value", label: "Value" },
    { key: "stage", label: "Stage" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { opportunity: "Enterprise Partnership", value: "$2.5M", stage: "Negotiation", status: "In Progress" },
    { opportunity: "Channel Partnership", value: "$1.2M", stage: "Proposal", status: "In Progress" },
    { opportunity: "Strategic Alliance", value: "$0.8M", stage: "Discovery", status: "Active" },
    { opportunity: "Joint Venture", value: "$0.5M", stage: "Due Diligence", status: "In Progress" },
    { opportunity: "Distribution Deal", value: "$0.2M", stage: "Closed", status: "Complete" },
  ];

  return (
    <AppShell>
      <ModulePage title="Business Development Manager" subtitle="Business development workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
