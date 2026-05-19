import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/risk-manager")({
  head: () => ({ meta: [{ title: "Risk Manager — SaaS Vala" }, { name: "description", content: "Risk management" }] }),
  component: Page,
});

function Page() {
  const { data: riskData, isLoading, error, refetch } = useQuery({
    queryKey: ["risk-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Risk Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Risk Manager" subtitle="Risk management" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Risk Manager"
          subtitle="Risk management"
          message="We couldn't load Risk Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Risk Score", value: "Low", delta: "—", up: true },
    { label: "Open Risks", value: "8", delta: "-2", up: true },
    { label: "Mitigation Rate", value: "92%", delta: "+3%", up: true },
    { label: "Incidents", value: "1", delta: "-1", up: true },
  ];

  const columns = [
    { key: "risk", label: "Risk" },
    { key: "category", label: "Category" },
    { key: "level", label: "Level" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { risk: "Market Volatility", category: "Financial", level: "Medium", status: "Monitoring" },
    { risk: "Cybersecurity", category: "Operational", level: "High", status: "Mitigated" },
    { risk: "Regulatory Changes", category: "Compliance", level: "Medium", status: "Monitoring" },
    { risk: "Key Person Dependency", category: "Operational", level: "Low", status: "Accepted" },
    { risk: "Supply Chain", category: "Operational", level: "Low", status: "Monitoring" },
  ];

  return (
    <AppShell>
      <ModulePage title="Risk Manager" subtitle="Risk management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
