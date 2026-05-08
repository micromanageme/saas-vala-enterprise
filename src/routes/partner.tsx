import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/partner")({
  head: () => ({ meta: [{ title: "Partner Dashboard — SaaS Vala" }, { name: "description", content: "Partner portal" }] }),
  component: Page,
});

function Page() {
  const { data: partnerData, isLoading, error } = useQuery({
    queryKey: ["partner-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/revenue");
      if (!response.ok) throw new Error("Failed to fetch Partner data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Partner Dashboard" subtitle="Partner portal" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Partner data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Referrals", value: "23", delta: "+5", up: true },
    { label: "Commission", value: "$2.5K", delta: "+18%", up: true },
    { label: "Active Deals", value: "8", delta: "+2", up: true },
    { label: "Conversion Rate", value: "34%", delta: "+3%", up: true },
  ] : [];

  const columns = [
    { key: "referral", label: "Referral" },
    { key: "company", label: "Company" },
    { key: "stage", label: "Stage" },
    { key: "commission", label: "Commission" },
  ];

  const rows = [
    { referral: "TechCorp", company: "TechCorp Inc", stage: "Closed", commission: "$450" },
    { referral: "Innovate Ltd", company: "Innovate Ltd", stage: "Negotiation", commission: "$320" },
    { referral: "Global Systems", company: "Global Systems", stage: "Proposal", commission: "$280" },
    { referral: "Future Tech", company: "Future Tech", stage: "Qualified", commission: "$180" },
    { referral: "Smart Solutions", company: "Smart Solutions", stage: "Discovery", commission: "$120" },
  ];

  return (
    <AppShell>
      <ModulePage title="Partner Dashboard" subtitle="Partner portal" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
