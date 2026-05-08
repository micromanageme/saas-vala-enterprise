import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/enterprise-architect")({
  head: () => ({ meta: [{ title: "Enterprise Architect — SaaS Vala" }, { name: "description", content: "Enterprise architecture oversight" }] }),
  component: Page,
});

function Page() {
  const { data: eaData, isLoading, error } = useQuery({
    queryKey: ["enterprise-architect-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard?type=all");
      if (!response.ok) throw new Error("Failed to fetch Enterprise Architect data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <ModulePage title="Enterprise Architect" subtitle="Enterprise architecture oversight" kpis={[]} columns={[]} rows={[]} />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="p-4 text-destructive">Failed to load Enterprise Architect data</div>
      </AppShell>
    );
  }

  const kpis = [
    { label: "Architecture Domains", value: "6", delta: "+1", up: true },
    { label: "Compliance Score", value: "94%", delta: "+2%", up: true },
    { label: "Technical Debt", value: "Low", delta: "—", up: true },
    { label: "Strategic Alignment", value: "92%", delta: "+3%", up: true },
  ];

  const columns = [
    { key: "domain", label: "Domain" },
    { key: "status", label: "Status" },
    { key: "maturity", label: "Maturity" },
    { key: "nextReview", label: "Next Review" },
  ];

  const rows = [
    { domain: "Business Architecture", status: "Defined", maturity: "Level 4", nextReview: "2024-09-01" },
    { domain: "Data Architecture", status: "Defined", maturity: "Level 4", nextReview: "2024-08-15" },
    { domain: "Application Architecture", status: "Defined", maturity: "Level 5", nextReview: "2024-07-30" },
    { domain: "Technology Architecture", status: "Defined", maturity: "Level 4", nextReview: "2024-08-01" },
    { domain: "Security Architecture", status: "Defined", maturity: "Level 5", nextReview: "2024-07-15" },
  ];

  return (
    <AppShell>
      <ModulePage title="Enterprise Architect" subtitle="Enterprise architecture oversight" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
