import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ModulePage } from "@/components/ModulePage";
import { DashboardSkeleton, DashboardError } from "@/components/DashboardStates";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/investment-manager")({
  head: () => ({ meta: [{ title: "Investment Manager — SaaS Vala" }, { name: "description", content: "Investment management" }] }),
  component: Page,
});

function Page() {
  const { data: investmentData, isLoading, error, refetch } = useQuery({
    queryKey: ["investment-manager-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/executive?type=all");
      if (!response.ok) throw new Error("Failed to fetch Investment Manager data");
      return response.json();
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <AppShell>
        <DashboardSkeleton title="Investment Manager" subtitle="Investment management" />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <DashboardError
          title="Investment Manager"
          subtitle="Investment management"
          message="We couldn't load Investment Manager data. The service may be unavailable or you may not have permission."
          onRetry={() => refetch()}
        />
      </AppShell>
    );
  }

  const kpis = [
    { label: "Portfolio Value", value: "$1.2M", delta: "+8%", up: true },
    { label: "ROI", value: "12.5%", delta: "+2.3%", up: true },
    { label: "Active Investments", value: "15", delta: "+2", up: true },
    { label: "Risk Score", value: "Medium", delta: "—", up: true },
  ];

  const columns = [
    { key: "investment", label: "Investment" },
    { key: "value", label: "Value" },
    { key: "return", label: "Return" },
    { key: "status", label: "Status" },
  ];

  const rows = [
    { investment: "Tech ETF", value: "$450K", return: "+15%", status: "Active" },
    { investment: "Corporate Bonds", value: "$300K", return: "+4.5%", status: "Active" },
    { investment: "Real Estate Fund", value: "$250K", return: "+8%", status: "Active" },
    { investment: "Startup Equity", value: "$120K", return: "+25%", status: "Active" },
    { investment: "Money Market", value: "$80K", return: "+2%", status: "Active" },
  ];

  return (
    <AppShell>
      <ModulePage title="Investment Manager" subtitle="Investment management" kpis={kpis} columns={columns} rows={rows} />
    </AppShell>
  );
}
