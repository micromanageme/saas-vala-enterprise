import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/telesales-executive")({
  head: () => ({ meta: [{ title: "Telesales Executive — SaaS Vala" }, { name: "description", content: "Telesales workspace" }] }),
  component: Page,
});

function Page() {
  const { data: telesalesData, isLoading, error } = useQuery({
    queryKey: ["telesales-executive-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Telesales Executive data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Telesales Executive" subtitle="Telesales workspace" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Telesales Executive data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Calls Made", value: "125", delta: "+25", up: true },
    { label: "Connections", value: "45", delta: "+8", up: true },
    { label: "Conversion Rate", value: "28%", delta: "+3%", up: true },
    { label: "Revenue Generated", value: "$12.5K", delta: "+$2.5K", up: true },
  ];

  const columns = [
    { key: "lead", label: "Lead" },
    { key: "status", label: "Status" },
    { key: "calls", label: "Calls" },
    { key: "nextAction", label: "Next Action" },
  ];

  const rows = [
    { lead: "Acme Corp", status: "Qualified", calls: "3", nextAction: "Follow-up Call" },
    { lead: "Tech Solutions", status: "Negotiation", calls: "5", nextAction: "Proposal" },
    { lead: "Global Retail", status: "Contacted", calls: "2", nextAction: "Discovery Call" },
    { lead: "StartUp Inc", status: "Qualified", calls: "4", nextAction: "Demo" },
    { lead: "Enterprise LLC", status: "Contacted", calls: "1", nextAction: "Initial Call" },
  ];

  return (
    <AppShell>
      <ModulePage title="Telesales Executive" subtitle="Telesales workspace" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
